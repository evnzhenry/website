const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireRole } = require('../middleware/rbac');

// GET /api/reports/portfolio
router.get('/portfolio', requireRole(['admin','officer','approver','underwriter']), async (req, res) => {
  try {
    const totals = await db.query('SELECT COUNT(*) as total, SUM(loan_amount) as volume FROM loans', []);
    const recent = await db.query('SELECT id, full_name, email, loan_amount, created_at FROM loans ORDER BY created_at DESC LIMIT 10', []);
    res.json({ totals: totals.rows && totals.rows[0] || {}, recent: recent.rows || [] });
  } catch (err) {
    console.error('Portfolio report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/reports/audit
router.get('/audit', requireRole(['admin']), async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100', []);
    res.json({ rows: rows.rows || [] });
  } catch (err) {
    console.error('Audit report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;