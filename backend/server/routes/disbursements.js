const express = require('express');
const router = express.Router();
const db = require('../db');
const { disburse } = require('../lib/payments-gateway');
const { requireRole } = require('../middleware/rbac');

// POST /api/disbursements/initiate
router.post('/initiate', requireRole(['admin','approver']), async (req, res) => {
  try {
    const { loan_id, account_id, amount, currency } = req.body || {};
    if (!loan_id || !account_id || !amount || !currency) return res.status(400).json({ error: 'Missing fields' });
    const pg = await disburse({ loanId: loan_id, accountId: account_id, amount: parseFloat(amount), currency });
    const ins = await db.query(`INSERT INTO disbursements (loan_id, account_id, amount, currency, method, status, provider_ref, created_at) VALUES (?,?,?,?,?,?,?, CURRENT_TIMESTAMP)`, [loan_id, account_id, parseFloat(amount), currency, 'gateway', pg.status, pg.provider_ref]);
    await db.query(`INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, metadata_json, timestamp) VALUES (?,?,?,?,?, CURRENT_TIMESTAMP)`, [null, 'disbursement_initiated', 'loan', loan_id, JSON.stringify({ account_id, amount, currency, pg })]);
    res.json({ id: ins.insertId, status: pg.status, provider_ref: pg.provider_ref });
  } catch (err) {
    console.error('Disbursement error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;