const express = require('express');
const router = express.Router();
const { runComplianceChecks } = require('../lib/compliance');

// POST /api/compliance/checks - run compliance checks against payload
router.post('/checks', async (req, res) => {
  try {
    const app = req.body || {};
    const result = runComplianceChecks({ age: app.age || 0, loan_amount: parseFloat(app.loan_amount || 0), email: app.email || '' });
    res.json(result);
  } catch (err) {
    console.error('Compliance check error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;