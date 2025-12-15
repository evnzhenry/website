const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite database path (switch to test DB if test mode)
const isTest = process.env.NODE_ENV === 'test' || process.env.USE_TEST_DB === 'true';
const dbFile = isTest ? 'stronic_test.db' : 'stronic_dev.db';
const dbPath = path.join(__dirname, '..', dbFile);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize tables
function initTables() {
  return new Promise((resolve, reject) => {
    const schema = `
      CREATE TABLE IF NOT EXISTS loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        date_of_birth TEXT NOT NULL,
        gender TEXT NOT NULL,
        primary_phone TEXT NOT NULL,
        secondary_phone TEXT,
        email TEXT NOT NULL,
        emergency_name TEXT,
        emergency_relation TEXT,
        emergency_phone TEXT,
        street_address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT NOT NULL,
        national_id_file TEXT,
        photo_file TEXT,
        reviewed_by TEXT,
        reviewed_at TEXT,
        loan_amount REAL NOT NULL,
        loan_purpose TEXT,
        source TEXT,
        eligible INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Borrower payout accounts
      CREATE TABLE IF NOT EXISTS payout_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        mobile_phone TEXT,
        bank_account_number TEXT,
        bank_code TEXT,
        bank_name TEXT,
        account_name TEXT,
        currency TEXT,
        verified INTEGER DEFAULT 0,
        verified_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Disbursement records
      CREATE TABLE IF NOT EXISTS disbursements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_id INTEGER NOT NULL,
        account_id INTEGER NOT NULL,
        amount REAL NOT NULL,
        currency TEXT NOT NULL,
        method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'queued',
        provider_ref TEXT,
        error_reason TEXT,
        initiated_by TEXT,
        idempotency_key TEXT,
        approved_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_loans_email ON loans (email);
      CREATE INDEX IF NOT EXISTS idx_loans_created_at ON loans (created_at);
      -- Removed idx_loans_source to avoid failures when column missing; added via migration if needed

      CREATE INDEX IF NOT EXISTS idx_payout_accounts_loan_id ON payout_accounts (loan_id);
      CREATE INDEX IF NOT EXISTS idx_payout_accounts_type ON payout_accounts (type);
      CREATE INDEX IF NOT EXISTS idx_payout_accounts_verified ON payout_accounts (verified);

      CREATE UNIQUE INDEX IF NOT EXISTS idx_disbursements_idempotency ON disbursements (idempotency_key);

      -- Creditor accounts (Source of funds)
      CREATE TABLE IF NOT EXISTS creditor_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        name TEXT NOT NULL,
        provider_name TEXT,
        account_number TEXT NOT NULL,
        currency TEXT NOT NULL DEFAULT 'KES',
        is_default INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Audit logs
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor_user_id INTEGER,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id INTEGER NOT NULL,
        metadata_json TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Approval stages
      CREATE TABLE IF NOT EXISTS approval_stages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        stage TEXT NOT NULL,
        decision TEXT NOT NULL,
        decided_by TEXT,
        decided_at TEXT DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      );

      -- Documents
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        file_path TEXT NOT NULL,
        mime TEXT,
        checksum TEXT,
        verified_status TEXT,
        uploaded_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_disbursements_loan_id ON disbursements (loan_id);
      CREATE INDEX IF NOT EXISTS idx_disbursements_account_id ON disbursements (account_id);
      CREATE INDEX IF NOT EXISTS idx_disbursements_status ON disbursements (status);
      CREATE INDEX IF NOT EXISTS idx_disbursements_created_at ON disbursements (created_at);

      -- Dedicated table for structured test records
      CREATE TABLE IF NOT EXISTS test_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'received',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_test_records_type ON test_records (type);
      CREATE INDEX IF NOT EXISTS idx_test_records_created_at ON test_records (created_at);
    `;

    db.exec(schema, (err) => {
      if (err) {
        console.error('Error creating tables:', err.message);
        reject(err);
      } else {
        // Migrate existing table: add columns if missing
        db.all(`PRAGMA table_info(loans);`, [], (err, rows) => {
          if (err) {
            console.error('Error reading table info:', err.message);
            return resolve();
          }
          const cols = rows.map(r => r.name);
          const tasks = [];
          if (!cols.includes('source')) {
            tasks.push(new Promise((res, rej) => {
              db.run('ALTER TABLE loans ADD COLUMN source TEXT', [], (e) => e ? rej(e) : res());
            }));
          }
          if (!cols.includes('eligible')) {
            tasks.push(new Promise((res, rej) => {
              db.run('ALTER TABLE loans ADD COLUMN eligible INTEGER', [], (e) => e ? rej(e) : res());
            }));
          }
          if (!cols.includes('created_at')) {
            tasks.push(new Promise((res, rej) => {
              db.run("ALTER TABLE loans ADD COLUMN created_at TEXT DEFAULT CURRENT_TIMESTAMP", [], (e) => e ? rej(e) : res());
            }));
          }
          Promise.all(tasks).then(() => {
            console.log('SQLite tables initialized successfully');
            resolve();
          }).catch((e) => {
            console.error('SQLite migration error:', e.message);
            resolve();
          });
        });
      }
    });
  });
}

// Promisify database operations
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    } else {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ insertId: this.lastID, changes: this.changes });
      });
    }
  });
}

module.exports = {
  db,
  query,
  initTables
};