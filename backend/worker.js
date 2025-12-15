// Simple BullMQ worker skeleton - processes background jobs (emails, heavy file tasks)
require('dotenv').config();
const { Worker, Queue } = require('bullmq');
const IORedis = require('ioredis');
const mysql = require('mysql2/promise');
const fetch = global.fetch || require('node-fetch');

const connection = new IORedis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
const queueName = process.env.JOBS_QUEUE_NAME || 'stronic-jobs';
const queue = new Queue(queueName, { connection });

// Minimal DB adapter: try MySQL, fallback to SQLite
let dbAdapter = null;
async function getDb() {
  if (dbAdapter) return dbAdapter;
  try {
    const url = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/stronic_db';
    const u = new URL(url);
    const cfg = { host: u.hostname, port: u.port ? parseInt(u.port, 10) : 3306, user: decodeURIComponent(u.username || ''), password: decodeURIComponent(u.password || ''), database: (u.pathname || '/').replace(/^\//, '') || 'stronic_db' };
    const pool = mysql.createPool({ ...cfg, waitForConnections: true, connectionLimit: 5 });
    dbAdapter = {
      async query(sql, params) {
        const [rows] = await pool.execute(sql, params);
        return { rows, rowCount: Array.isArray(rows) ? rows.length : (rows && rows.affectedRows) || 0, insertId: rows && rows.insertId };
      }
    };
    return dbAdapter;
  } catch (e) {
    const sqliteDb = require('./server/db-sqlite');
    await sqliteDb.initTables();
    dbAdapter = {
      async query(sql, params) {
        const result = await sqliteDb.query(sql, params);
        if (Array.isArray(result)) return { rows: result, rowCount: result.length };
        return { rows: result, rowCount: result.changes || 0, insertId: result.insertId };
      }
    };
    return dbAdapter;
  }
}

const providers = require('./server/lib/disbursementProviders');

const worker = new Worker(queueName, async (job) => {
  console.log('Processing job', job.id, job.name, job.data);
  const db = await getDb();

  if (job.name === 'disburse') {
    const { disbursement_id, loan_id, account_id, method, creditor_account_id } = job.data || {};
    // Load account + disbursement details
    const accRes = await db.query('SELECT * FROM payout_accounts WHERE id=?', [account_id]);
    const account = accRes.rows && accRes.rows[0];
    const disbRes = await db.query('SELECT * FROM disbursements WHERE id=?', [disbursement_id]);
    const disb = disbRes.rows && disbRes.rows[0];

    let sourceAccount = null;
    if (creditor_account_id) {
      const credRes = await db.query('SELECT * FROM creditor_accounts WHERE id=?', [creditor_account_id]);
      sourceAccount = credRes.rows && credRes.rows[0];
    }

    if (!account || !disb) throw new Error('Missing account or disbursement');

    let result = { status: 'failed', error_reason: 'Unsupported method' };
    try {
      if (String(method).toLowerCase() === 'mobile_money') {
        result = await providers.processMobileMoney({ amount: disb.amount, currency: disb.currency, mobile_phone: account.mobile_phone, sourceAccount });
      } else if (String(method).toLowerCase() === 'bank_transfer') {
        result = await providers.processBankTransfer({ amount: disb.amount, currency: disb.currency, bank_account_number: account.bank_account_number, bank_code: account.bank_code, bank_name: account.bank_name, account_name: account.account_name, sourceAccount });
      }
    } catch (e) {
      result = { status: 'failed', error_reason: e && e.message ? e.message : String(e) };
    }

    // Persist update
    await db.query('UPDATE disbursements SET status=?, provider_ref=?, error_reason=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [result.status, result.provider_ref || null, result.error_reason || null, disbursement_id]);

    // Notify server (SSE forward)
    try {
      const base = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
      const key = process.env.INTERNAL_KEY || 'dev-key';
      await fetch(`${base}/api/admin/events/disbursement-update`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Internal-Key': key }, body: JSON.stringify({ id: disbursement_id, loan_id, account_id, status: result.status, provider_ref: result.provider_ref || null, error_reason: result.error_reason || null }) });
    } catch (e) {
      console.warn('Failed to notify server of disbursement update', e && e.message ? e.message : e);
    }
  }

  // Example job handlers remain
  if (job.name === 'sendEmail') {
    console.log('Would send email to', job.data.to);
  }
  if (job.name === 'processUpload') {
    console.log('Would process upload', job.data.path);
  }
}, { connection });

worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.error(`Job ${job.id} failed`, err));

console.log('Worker started for queue', queueName);
