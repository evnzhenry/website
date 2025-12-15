const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const events = require('../lib/events');

// POST /api/admin/login - Local auth with hardcoded credentials (TESTING ONLY)
router.post('/login', (req, res) => {
  const { username, email, password } = req.body;
  // Frontend sends 'email'
  const user = username || email;
  if (user === 'support@stronicholdings.com' && password === 'password123') {
    const token = jwt.sign({ sub: 'admin', role: 'admin' }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '24h' });
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

// Middleware to require admin authentication via JWT
async function requireAdmin(req, res, next) {
  try {
    let token = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.slice(7);
    } else if (req.query.token) {
      token = String(req.query.token);
    }

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'test_secret');
    if (verified.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    req.admin = verified;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.use(requireAdmin);

// Server-Sent Events for real-time admin updates
router.get('/events', (req, res) => {
  // At this point, requireAdminAuth has verified admin via key or token
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Initial event to confirm connection
  res.write(`event: connected\n`);
  res.write(`data: {"ok":true}\n\n`);

  const onLoanCreated = (payload) => {
    res.write(`event: loan.created\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const onContactCreated = (payload) => {
    res.write(`event: contact.created\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  const onLoanReviewed = (payload) => {
    res.write(`event: loan.reviewed\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  // New: Disbursement events
  const onDisbursementCreated = (payload) => {
    res.write(`event: disbursement.created\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };
  const onDisbursementUpdated = (payload) => {
    res.write(`event: disbursement.updated\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  events.on('loan.created', onLoanCreated);
  events.on('contact.created', onContactCreated);
  events.on('loan.reviewed', onLoanReviewed);
  // New subscriptions
  events.on('disbursement.created', onDisbursementCreated);
  events.on('disbursement.updated', onDisbursementUpdated);

  // Keep-alive ping every 30s
  const ping = setInterval(() => {
    res.write(`event: ping\n`);
    res.write(`data: {"ts":${Date.now()}}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(ping);
    events.off('loan.created', onLoanCreated);
    events.off('contact.created', onContactCreated);
    events.off('loan.reviewed', onLoanReviewed);
    // New unsubscriptions
    events.off('disbursement.created', onDisbursementCreated);
    events.off('disbursement.updated', onDisbursementUpdated);
  });
});





// POST /api/admin/loans/:id/review - mark reviewed
router.post('/loans/:id/review', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const reviewer = req.headers['x-admin-user'] || (req.admin && req.admin.sub) || 'admin';
    const q = 'UPDATE loans SET reviewed_by=?, reviewed_at=CURRENT_TIMESTAMP WHERE id=?';
    const result = await db.query(q, [reviewer, id]);
    if (!result || result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    // Fetch updated row for response
    const sel = await db.query('SELECT id, reviewed_by, reviewed_at FROM loans WHERE id=?', [id]);

    // Broadcast loan.reviewed event
    try {
      const row = sel.rows && sel.rows[0];
      events.emit('loan.reviewed', { id, reviewed_by: reviewer, reviewed_at: row && row.reviewed_at });
    } catch (e) { /* non-blocking */ }

    res.json({ success: true, row: sel.rows && sel.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark item as viewed (audit log)
router.post('/view/:type/:id', async (req, res) => {
  try {
    const itemType = String(req.params.type);
    const id = parseInt(req.params.id, 10);
    if (!['loan', 'contact'].includes(itemType) || !id) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    const adminUser = (req.headers['x-admin-user'] || (req.admin && req.admin.sub) || 'admin').toString();

    // Upsert via update-then-insert for cross-DB compatibility
    const upd = await db.query(
      'UPDATE admin_views SET viewed_at=CURRENT_TIMESTAMP WHERE admin_user=? AND item_type=? AND item_id=?',
      [adminUser, itemType, id]
    );
    if (!upd || upd.rowCount === 0) {
      await db.query(
        'INSERT INTO admin_views (admin_user, item_type, item_id, viewed_at) VALUES (?,?,?, CURRENT_TIMESTAMP)',
        [adminUser, itemType, id]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/loans - paginated, searchable, seen status, status filter
router.get('/loans', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '25', 10), 200);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const offset = (page - 1) * limit;
    const params = [];
    const where = [];

    if (req.query.q) {
      params.push(`%${req.query.q}%`);
      where.push('(l.full_name LIKE ? OR l.email LIKE ? OR l.primary_phone LIKE ? OR l.loan_purpose LIKE ?)');
      params.push(params[0], params[0], params[0]);
    }

    const adminUser = (req.headers['x-admin-user'] || (req.admin && req.admin.sub) || 'admin').toString();
    const status = String(req.query.status || 'all');

    let statusClause = '';
    if (status === 'unseen') {
      statusClause = 'AND av.viewed_at IS NULL';
    } else if (status === 'seen') {
      statusClause = 'AND av.viewed_at IS NOT NULL';
    }

    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

    const dataSql = `
      SELECT 
        l.id, l.full_name, l.email, l.primary_phone, l.loan_amount, l.created_at, l.national_id_file, l.photo_file, l.reviewed_by, l.reviewed_at, l.loan_purpose, l.street_address, l.city, l.state, l.zip_code,
        l.source, l.eligible,
        CASE WHEN av.viewed_at IS NULL THEN 0 ELSE 1 END AS seen,
        av.viewed_at AS seen_at
      FROM loans l
      LEFT JOIN admin_views av ON av.item_type='loan' AND av.item_id=l.id AND av.admin_user=?
      ${whereSql} 
      ${statusClause ? statusClause : ''}
      ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;

    const dataParams = [adminUser].concat(params, [limit, offset]);
    const dataRes = await db.query(dataSql, dataParams);

    // total count respecting status filter
    const countSql = `
      SELECT COUNT(*) AS cnt
      FROM loans l
      LEFT JOIN admin_views av ON av.item_type='loan' AND av.item_id=l.id AND av.admin_user=?
      ${whereSql} 
      ${statusClause ? statusClause : ''}`;
    const countParams = [adminUser].concat(req.query.q ? [params[0], params[0], params[0], params[0]] : []);
    const cntRes = await db.query(countSql, countParams);
    const total = Array.isArray(cntRes.rows) && cntRes.rows[0] ? (cntRes.rows[0].cnt || cntRes.rows[0]['COUNT(*)'] || 0) : 0;

    // unread_total (global, without status/search filters)
    const unreadRes = await db.query(
      `SELECT COUNT(*) AS cnt FROM loans l LEFT JOIN admin_views av ON av.item_type='loan' AND av.item_id=l.id AND av.admin_user=? WHERE av.viewed_at IS NULL`,
      [adminUser]
    );
    const unread_total = Array.isArray(unreadRes.rows) && unreadRes.rows[0] ? (unreadRes.rows[0].cnt || 0) : 0;

    res.json({ rows: dataRes.rows, page, limit, total, unread_total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/loans/:id - single loan details
router.get('/loans/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const adminUser = (req.headers['x-admin-user'] || (req.admin && req.admin.sub) || 'admin').toString();

    // 1. Fetch Loan Details
    const loanSql = `
      SELECT 
        l.*,
        CASE WHEN av.viewed_at IS NULL THEN 0 ELSE 1 END AS seen,
        av.viewed_at AS seen_at
      FROM loans l
      LEFT JOIN admin_views av ON av.item_type='loan' AND av.item_id=l.id AND av.admin_user=?
      WHERE l.id = ?`;

    const loanRes = await db.query(loanSql, [adminUser, id]);
    const loan = loanRes.rows && loanRes.rows[0];

    if (!loan) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    // 2. Mark as Viewed (Audit)
    // We do this asynchronously or blocking, blocking ensures 'seen' is true next time
    try {
      const upd = await db.query(
        'UPDATE admin_views SET viewed_at=CURRENT_TIMESTAMP WHERE admin_user=? AND item_type=? AND item_id=?',
        [adminUser, 'loan', id]
      );
      if (!upd || upd.rowCount === 0) {
        await db.query(
          'INSERT INTO admin_views (admin_user, item_type, item_id, viewed_at) VALUES (?,?,?, CURRENT_TIMESTAMP)',
          [adminUser, 'loan', id]
        );
      }
    } catch (e) {
      console.error("Failed to update view log", e);
    }

    // 3. Fetch Payout Account (if any)
    const payoutSql = `SELECT * FROM payout_accounts WHERE loan_id = ?`;
    const payoutRes = await db.query(payoutSql, [id]);
    const payout_account = payoutRes.rows && payoutRes.rows[0];

    // 4. Fetch Disbursement Details (if any)
    const disbSql = `SELECT * FROM disbursements WHERE loan_id = ? ORDER BY created_at DESC LIMIT 1`;
    const disbRes = await db.query(disbSql, [id]);
    const disbursement = disbRes.rows && disbRes.rows[0];

    // 5. Fetch Audit Logs (Status changes, etc - simplified for now as we don't have a dedicated audit table yet, 
    // using admin_views and loan fields)
    // In a real system, we'd query a separate audit_logs table. 
    // For now, we construct a simple timeline from available data.
    const timeline = [
      { type: 'created', timestamp: loan.created_at, user: 'System' },
    ];
    if (loan.reviewed_at) {
      timeline.push({ type: 'reviewed', timestamp: loan.reviewed_at, user: loan.reviewed_by, status: loan.status }); // Assuming status is tracked on loan
    }
    if (disbursement) {
      timeline.push({ type: 'disbursement_queued', timestamp: disbursement.created_at, user: disbursement.initiated_by });
      if (disbursement.processed_at) {
        timeline.push({ type: 'disbursed', timestamp: disbursement.processed_at, user: 'System' });
      }
    }

    res.json({
      ...loan,
      payout_account,
      disbursement,
      timeline
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/contacts - paginated + searchable + seen status + status filter
router.get('/contacts', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '25', 10), 200);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const offset = (page - 1) * limit;
    const params = [];
    const where = [];
    if (req.query.q) {
      params.push(`%${req.query.q}%`);
      where.push('(c.name LIKE ? OR c.email LIKE ? OR c.subject LIKE ? OR c.message LIKE ?)');
      params.push(params[0], params[0], params[0]);
    }
    const adminUser = (req.headers['x-admin-user'] || (req.admin && req.admin.sub) || 'admin').toString();
    const status = String(req.query.status || 'all');

    let statusClause = '';
    if (status === 'unseen') {
      statusClause = 'AND av.viewed_at IS NULL';
    } else if (status === 'seen') {
      statusClause = 'AND av.viewed_at IS NOT NULL';
    }

    const whereSql = where.length ? ('WHERE ' + where.join(' AND ')) : '';

    const base = `
      SELECT c.id, c.name, c.email, c.subject, c.message, c.created_at,
             CASE WHEN av.viewed_at IS NULL THEN 0 ELSE 1 END AS seen,
             av.viewed_at AS seen_at
      FROM contacts c
      LEFT JOIN admin_views av ON av.item_type='contact' AND av.item_id=c.id AND av.admin_user=?
      ${whereSql}
      ${statusClause ? statusClause : ''}
      ORDER BY c.created_at DESC LIMIT ? OFFSET ?`;
    const data = await db.query(base, [adminUser].concat(params, [limit, offset]));

    const countSql = `
      SELECT COUNT(*) AS cnt
      FROM contacts c
      LEFT JOIN admin_views av ON av.item_type='contact' AND av.item_id=c.id AND av.admin_user=?
      ${whereSql}
      ${statusClause ? statusClause : ''}`;
    const cntRes = await db.query(countSql, [adminUser].concat(req.query.q ? [params[0], params[0], params[0], params[0]] : []));
    const total = Array.isArray(cntRes.rows) && cntRes.rows[0] ? (cntRes.rows[0].cnt || cntRes.rows[0]['COUNT(*)'] || 0) : 0;

    const unreadRes = await db.query(
      `SELECT COUNT(*) AS cnt FROM contacts c LEFT JOIN admin_views av ON av.item_type='contact' AND av.item_id=c.id AND av.admin_user=? WHERE av.viewed_at IS NULL`,
      [adminUser]
    );
    const unread_total = Array.isArray(unreadRes.rows) && unreadRes.rows[0] ? (unreadRes.rows[0].cnt || 0) : 0;

    res.json({ rows: data.rows, page, limit, total, unread_total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/loans/:id/disburse - queue disbursement
router.post('/loans/:id/disburse', async (req, res) => {
  try {
    const loan_id = parseInt(req.params.id, 10);
    const { account_id, amount, currency, method, idempotency_key } = req.body || {};
    if (!loan_id || !account_id || !amount || !method) {
      return res.status(400).json({ error: 'loan_id, account_id, amount, method are required' });
    }

    // Resolve payout account type/details
    const accRes = await db.query('SELECT * FROM payout_accounts WHERE id=? AND loan_id=?', [account_id, loan_id]);
    const account = accRes.rows && accRes.rows[0];
    if (!account) return res.status(404).json({ error: 'Payout account not found for loan' });
    if (!account.verified) return res.status(400).json({ error: 'Payout account must be verified' });

    // Fetch default creditor account
    const credRes = await db.query('SELECT * FROM creditor_accounts WHERE is_default=1 LIMIT 1');
    const creditor_account = (credRes.rows || credRes)[0];
    // if (!creditor_account) return res.status(400).json({ error: 'No default creditor account configured' });

    // Create disbursement row (queued)
    const disbSql = `INSERT INTO disbursements (loan_id, account_id, amount, currency, method, status, idempotency_key, initiated_by, created_at) VALUES (?,?,?,?,?, 'queued', ?, ?, CURRENT_TIMESTAMP)`;
    const initiated_by = (req.admin && req.admin.sub) || 'admin';
    const disbRes = await db.query(disbSql, [loan_id, account_id, amount, currency || account.currency || null, String(method), idempotency_key || null, initiated_by]);
    const disbursement_id = disbRes.insertId;

    // Emit disbursement.created
    try {
      events.emit('disbursement.created', { id: disbursement_id, loan_id, account_id, amount, currency: currency || account.currency || null, method, status: 'queued', initiated_by });
    } catch { }

    // Enqueue background processing
    try {
      const { enqueue } = require('../lib/queue');
      await enqueue('disburse', {
        disbursement_id,
        loan_id,
        account_id,
        method,
        creditor_account_id: creditor_account ? creditor_account.id : null
      });
    } catch (e) {
      console.warn('Failed to enqueue disbursement job', e && e.message ? e.message : e);
    }

    res.json({ success: true, id: disbursement_id });
  } catch (err) {
    console.error('Disbursement trigger error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Internal webhook: forward worker disbursement updates to SSE
router.post('/events/disbursement-update', async (req, res) => {
  try {
    const key = req.headers['x-internal-key'];
    if (!process.env.INTERNAL_KEY || key !== process.env.INTERNAL_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const payload = req.body || {};
    events.emit('disbursement.updated', payload);
    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Creditor Accounts Management ---

// GET /api/admin/creditor-accounts
router.get('/creditor-accounts', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM creditor_accounts ORDER BY created_at DESC');
    res.json({ rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/creditor-accounts
router.post('/creditor-accounts', async (req, res) => {
  try {
    const { type, name, provider_name, account_number, currency } = req.body;
    if (!type || !name || !account_number) return res.status(400).json({ error: 'Missing required fields' });

    // Check if first account, make default if so
    const existing = await db.query('SELECT COUNT(*) as cnt FROM creditor_accounts');
    const is_default = (existing[0] && existing[0].cnt === 0) ? 1 : 0; // Check rows[0] structure diff for sqlite vs mysql wrapper

    // SQLite wrapper returns array directly for SELECT
    // But let's be safe with the wrapper I saw in db-sqlite.js: "resolve(rows)"
    const count = (Array.isArray(existing) && existing[0]) ? (existing[0].cnt || existing[0]['COUNT(*)']) : 0;
    const isDefaultVal = count === 0 ? 1 : 0;

    const sql = 'INSERT INTO creditor_accounts (type, name, provider_name, account_number, currency, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)';
    const result = await db.query(sql, [type, name, provider_name, account_number, currency || 'KES', isDefaultVal]);

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/creditor-accounts/:id/set-default
router.post('/creditor-accounts/:id/set-default', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Unset all
    await db.query('UPDATE creditor_accounts SET is_default=0');
    // Set target
    await db.query('UPDATE creditor_accounts SET is_default=1 WHERE id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/creditor-accounts/:id
router.delete('/creditor-accounts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // don't delete if it is default? maybe enforce at least one default
    await db.query('DELETE FROM creditor_accounts WHERE id=?', [id]);

    // If we deleted the default, set another one as default? (Optional logic, skipping for simplicity)

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
