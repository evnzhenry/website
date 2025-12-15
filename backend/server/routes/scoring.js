const express = require('express');
const router = express.Router();
const { fetchCreditReport } = require('../lib/credit-bureau');

// POST /api/scoring/credit-report
router.post('/credit-report', async (req, res) => {
  try {
    const { age, requestedAmount } = req.body || {};
    const report = await fetchCreditReport({ age, requestedAmount });
    res.json(report);
  } catch (err) {
    console.error('Credit report error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;