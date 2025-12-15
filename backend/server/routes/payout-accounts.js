const express = require('express');
const router = express.Router();
const db = require('../db');

function isSupportedType(t) { return ['mobile_money','bank_transfer'].includes(String(t || '').toLowerCase()); }

// POST /api/payout-accounts - create payout account for a loan
router.post('/', async (req, res) => {
  try {
    const { loan_id, type, mobile_phone, bank_account_number, bank_code, bank_name, account_name, currency } = req.body || {};
    if (!loan_id || !type || !isSupportedType(type)) {
      return res.status(400).json({ error: 'loan_id and valid type are required' });
    }

    const ins = `INSERT INTO payout_accounts (loan_id, type, mobile_phone, bank_account_number, bank_code, bank_name, account_name, currency, verified, created_at) VALUES (?,?,?,?,?,?,?,?,0, CURRENT_TIMESTAMP)`;
    const params = [loan_id, String(type), mobile_phone || null, bank_account_number || null, bank_code || null, bank_name || null, account_name || null, currency || null];
    const result = await db.query(ins, params);
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Create payout account error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/payout-accounts/by-loan/:loanId - list accounts for a loan
router.get('/by-loan/:loanId', async (req, res) => {
  try {
    const loanId = parseInt(req.params.loanId, 10);
    if (!loanId) return res.status(400).json({ error: 'Invalid loan id' });
    const rows = await db.query('SELECT * FROM payout_accounts WHERE loan_id=? ORDER BY created_at DESC', [loanId]);
    res.json({ rows: rows.rows || [] });
  } catch (err) {
    console.error('List payout accounts error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/payout-accounts/:id/verify - mark account verified
router.post('/:id/verify', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const upd = await db.query('UPDATE payout_accounts SET verified=1, verified_at=CURRENT_TIMESTAMP WHERE id=?', [id]);
    if (!upd || upd.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Verify payout account error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;