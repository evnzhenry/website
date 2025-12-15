const express = require('express');
const router = express.Router();
const { decide } = require('../lib/decision');
const db = require('../db');

// GET /api/workflow/config - thresholds
router.get('/config', (req, res) => {
  res.json({ thresholds: { maxAmount: 100000, autoApproveScore: 750, minScore: 500 } });
});

// POST /api/workflow/decide
router.post('/decide', async (req, res) => {
  try {
    const { application_id, amount, riskScore, compliancePassed } = req.body || {};
    const result = decide({ amount: parseFloat(amount || 0), riskScore: parseFloat(riskScore || 0), compliancePassed: !!compliancePassed });
    if (application_id) {
      await db.query(`INSERT INTO approval_stages (application_id, stage, decision, decided_by, decided_at, notes) VALUES (?,?,?,?, CURRENT_TIMESTAMP, ?)`, [application_id, 'auto', result.decision, 'system', result.reason]);
      await db.query(`INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, metadata_json, timestamp) VALUES (?,?,?,?,?, CURRENT_TIMESTAMP)`, [null, 'auto_decision', 'loan', application_id, JSON.stringify(result)]);
    }
    res.json(result);
  } catch (err) {
    console.error('Workflow decide error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;