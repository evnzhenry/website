require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

const apiLimiter = require('./server/middleware/rateLimiter');

const app = express();
app.use(helmet());
const origins = (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: origins.length ? origins : true, credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files only (frontend is served by Next.js)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply a rate limiter to all /api routes
app.use('/api', apiLimiter);

// Lightweight metrics for /api requests
const metrics = {
  startTime: Date.now(),
  totalRequests: 0,
  totalErrors: 0,
  routes: {}
};

app.use((req, res, next) => {
  if (!req.originalUrl.startsWith('/api')) return next();
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const status = res.statusCode;
    const routeKey = `${req.method} ${req.baseUrl}${req.route ? req.route.path : req.path}`;
    const rec = metrics.routes[routeKey] || { requests: 0, errors: 0, avgMs: 0, maxMs: 0, minMs: null, lastStatus: null };
    rec.requests += 1;
    if (status >= 500) rec.errors += 1;
    rec.lastStatus = status;
    rec.maxMs = Math.max(rec.maxMs, durationMs);
    rec.minMs = rec.minMs == null ? durationMs : Math.min(rec.minMs, durationMs);
    // Exponential moving average
    rec.avgMs = rec.avgMs === 0 ? durationMs : (rec.avgMs * 0.9 + durationMs * 0.1);
    metrics.routes[routeKey] = rec;
    metrics.totalRequests += 1;
    if (status >= 500) metrics.totalErrors += 1;
  });
  next();
});

// Mount API routes
app.use('/api/loans', require('./server/routes/loans'));
app.use('/api/applications', require('./server/routes/applications'));
app.use('/api/contacts', require('./server/routes/contacts'));

app.use('/api/loan-status', require('./server/routes/loan-status'));
app.use('/api/payout-accounts', require('./server/routes/payout-accounts'));
app.use('/api/documents', require('./server/routes/documents'));
app.use('/api/compliance', require('./server/routes/compliance'));
app.use('/api/scoring', require('./server/routes/scoring'));
app.use('/api/workflow', require('./server/routes/workflow'));
app.use('/api/disbursements', require('./server/routes/disbursements'));
app.use('/api/notifications', require('./server/routes/notifications'));
app.use('/api/admin', require('./server/routes/admin'));
app.use('/api/test-data', require('./server/routes/test-data'));

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: (Date.now() - metrics.startTime) / 1000 });
});

function getConfigFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    return {
      host: u.hostname || 'localhost',
      port: u.port ? parseInt(u.port, 10) : 3306,
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      database: (u.pathname || '/').replace(/^\//, '') || 'stronic_db'
    };
  } catch (e) {
    return {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'stronic_db'
    };
  }
}

function resolveDbUrl() {
  const isTest = process.env.NODE_ENV === 'test' || process.env.USE_TEST_DB === 'true';
  const testUrl = process.env.TEST_DATABASE_URL;
  const prodUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/stronic_db';
  return isTest && testUrl ? testUrl : prodUrl;
}

async function initDatabase() {
  // Try MySQL first, fallback to SQLite for development
  const url = resolveDbUrl();

  try {
    const cfg = getConfigFromUrl(url);
    console.log(`Connecting to MySQL at ${cfg.host}:${cfg.port} as ${cfg.user || '(no user)'}...`);
    // Connect without database to ensure DB exists
    const serverConn = await mysql.createConnection({ host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password });
    await serverConn.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await serverConn.end();
    console.log(`Database '${cfg.database}' is ready.`);

    // Connect to target DB and decide whether to apply schema
    const dbConn = await mysql.createConnection({ host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password, database: cfg.database });
    const [rowsLoans] = await dbConn.query(
      'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = ?',
      [cfg.database, 'loans']
    );
    const [rowsContacts] = await dbConn.query(
      'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema = ? AND table_name = ?',
      [cfg.database, 'contacts']
    );
    const hasLoans = rowsLoans && rowsLoans[0] && rowsLoans[0].cnt > 0;
    const hasContacts = rowsContacts && rowsContacts[0] && rowsContacts[0].cnt > 0;
    if (hasLoans && hasContacts) {
      console.log('Schema already present; checking for migrations...');
      // Ensure new columns exist
      const [cols] = await dbConn.query(
        `SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema=? AND table_name='loans'`,
        [cfg.database]
      );
      const colNames = cols.map(c => c.COLUMN_NAME);
      const alters = [];
      if (!colNames.includes('source')) alters.push('ADD COLUMN `source` VARCHAR(64)');
      if (!colNames.includes('eligible')) alters.push('ADD COLUMN `eligible` TINYINT(1)');
      if (alters.length) {
        const alterSql = `ALTER TABLE \`loans\` ${alters.join(', ')}`;
        await dbConn.query(alterSql);
        // Add index on source if missing
        const [idxRows] = await dbConn.query(
          `SELECT COUNT(*) AS cnt FROM information_schema.statistics WHERE table_schema=? AND table_name='loans' AND index_name='idx_loans_source'`,
          [cfg.database]
        );
        const hasSourceIdx = idxRows && idxRows[0] && idxRows[0].cnt > 0;
        if (!hasSourceIdx) {
          await dbConn.query('CREATE INDEX idx_loans_source ON loans (source)');
        }
        console.log('Applied MySQL migrations for loans table');
      }

      // Ensure new tables exist: payout_accounts, disbursements
      const [payoutT] = await dbConn.query(
        'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema=? AND table_name=?',
        [cfg.database, 'payout_accounts']
      );
      const [disbT] = await dbConn.query(
        'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema=? AND table_name=?',
        [cfg.database, 'disbursements']
      );
      const hasPayout = payoutT && payoutT[0] && payoutT[0].cnt > 0;
      const hasDisb = disbT && disbT[0] && disbT[0].cnt > 0;

      if (!hasPayout) {
        await dbConn.query(`CREATE TABLE IF NOT EXISTS payout_accounts (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          loan_id BIGINT NOT NULL,
          type VARCHAR(32) NOT NULL,
          mobile_phone VARCHAR(50),
          bank_account_number VARCHAR(64),
          bank_code VARCHAR(32),
          bank_name VARCHAR(128),
          account_name VARCHAR(128),
          currency VARCHAR(3),
          verified TINYINT(1) DEFAULT 0,
          verified_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_payout_accounts_loan FOREIGN KEY (loan_id) REFERENCES loans(id)
        )`);
        await dbConn.query('CREATE INDEX idx_payout_accounts_loan_id ON payout_accounts (loan_id)');
        await dbConn.query('CREATE INDEX idx_payout_accounts_type ON payout_accounts (type)');
        await dbConn.query('CREATE INDEX idx_payout_accounts_verified ON payout_accounts (verified)');
        console.log('Created payout_accounts table');
      }

      if (!hasDisb) {
        await dbConn.query(`CREATE TABLE IF NOT EXISTS disbursements (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          loan_id BIGINT NOT NULL,
          account_id BIGINT NOT NULL,
          amount DECIMAL(12,2) NOT NULL,
          currency VARCHAR(3) NOT NULL,
          method VARCHAR(32) NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'queued',
          provider_ref VARCHAR(128),
          error_reason TEXT,
          initiated_by VARCHAR(255),
          idempotency_key VARCHAR(128) UNIQUE,
          approved_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT fk_disbursements_loan FOREIGN KEY (loan_id) REFERENCES loans(id),
          CONSTRAINT fk_disbursements_account FOREIGN KEY (account_id) REFERENCES payout_accounts(id)
        )`);
        await dbConn.query('CREATE INDEX idx_disbursements_loan_id ON disbursements (loan_id)');
        await dbConn.query('CREATE INDEX idx_disbursements_account_id ON disbursements (account_id)');
        await dbConn.query('CREATE INDEX idx_disbursements_status ON disbursements (status)');
        await dbConn.query('CREATE INDEX idx_disbursements_created_at ON disbursements (created_at)');
        console.log('Created disbursements table');
      }

      // Ensure test_records table exists for test data
      const [testRecT] = await dbConn.query(
        'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema=? AND table_name=?',
        [cfg.database, 'test_records']
      );
      const hasTestRecords = testRecT && testRecT[0] && testRecT[0].cnt > 0;
      if (!hasTestRecords) {
        await dbConn.query(`CREATE TABLE IF NOT EXISTS test_records (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          type VARCHAR(64) NOT NULL,
          payload JSON NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'received',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
        await dbConn.query('CREATE INDEX idx_test_records_type ON test_records (type)');
        await dbConn.query('CREATE INDEX idx_test_records_created_at ON test_records (created_at)');
        console.log('Created test_records table');
      }

      // Ensure admin_views table exists
      const [adminViewT] = await dbConn.query(
        'SELECT COUNT(*) AS cnt FROM information_schema.tables WHERE table_schema=? AND table_name=?',
        [cfg.database, 'admin_views']
      );
      const hasAdminViews = adminViewT && adminViewT[0] && adminViewT[0].cnt > 0;
      if (!hasAdminViews) {
        await dbConn.query(`CREATE TABLE IF NOT EXISTS admin_views (
          admin_user VARCHAR(255),
          item_type VARCHAR(32),
          item_id INT,
          viewed_at DATETIME,
          PRIMARY KEY (admin_user, item_type, item_id)
        )`);
        console.log('Created admin_views table');
      }

      await dbConn.end();
      return;
    }

    // Load schema (MySQL) only if missing
    const schemaPathCandidates = [
      path.join(__dirname, 'server', 'schema.mysql.sql'),
      path.join(__dirname, 'server', 'schema.sql')
    ];
    const schemaPath = schemaPathCandidates.find(p => fs.existsSync(p));
    if (schemaPath) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await dbConn.end();
      const applyConn = await mysql.createConnection({ host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password, database: cfg.database, multipleStatements: true });
      await applyConn.query(sql);
      await applyConn.end();
      console.log(`Applied schema from ${path.basename(schemaPath)}.`);
    } else {
      await dbConn.end();
      console.warn('No schema file found; skipping schema init.');
    }
  } catch (error) {
    console.warn('MySQL connection failed, falling back to SQLite for development:', error.message);

    // Initialize SQLite fallback
    const sqliteDb = require('./server/db-sqlite');
    await sqliteDb.initTables();

    // Set global flag for routes to use SQLite
    global.useSQLite = true;
    console.log('Using SQLite database for development');
  }
}

async function start() {
  try {
    await initDatabase();
    const port = parseInt(process.env.PORT || '3000', 10);
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (e) {
    console.error('Fatal boot error', e);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, initDatabase, start };
