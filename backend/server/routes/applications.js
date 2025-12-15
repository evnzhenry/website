const express = require('express');
const router = express.Router();
const db = require('../db');
const { runComplianceChecks } = require('../lib/compliance');
const { fetchCreditReport } = require('../lib/credit-bureau');
const { decide } = require('../lib/decision');
const { requireRole } = require('../middleware/rbac');

// POST /api/applications - JSON intake (alternative to /api/loans multipart)
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const required = ['full_name', 'date_of_birth', 'email', 'primary_phone', 'loan_amount'];
    for (const f of required) {
      if (!body[f]) return res.status(400).json({ error: `Missing ${f}` });
    }

    // Insert into loans as submitted application
    const ins = `INSERT INTO loans (full_name, date_of_birth, gender, primary_phone, secondary_phone, email, street_address, city, state, zip_code, loan_amount, loan_purpose, source, eligible, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,NULL, CURRENT_TIMESTAMP)`;
    const params = [
      body.full_name,
      body.date_of_birth,
      body.gender || '',
      body.primary_phone,
      body.secondary_phone || null,
      body.email,
      body.street_address || '',
      body.city || '',
      body.state || '',
      body.zip_code || '',
      parseFloat(body.loan_amount),
      body.loan_purpose || null,
      body.source || 'web'
    ];
    const result = await db.query(ins, params);
    const applicationId = result.insertId;

    // Handle Disbursement Details
    if (body.disbursement_method) {
      const disbType = body.disbursement_method; // 'bank' or 'mobile_money'
      let disbSql = '';
      let disbParams = [];

      if (disbType === 'bank') {
        disbSql = `INSERT INTO payout_accounts (loan_id, type, bank_name, bank_account_number, account_name, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
        disbParams = [applicationId, 'bank', body.bank_name, body.bank_account_number, body.bank_account_name];
      } else if (disbType === 'mobile_money') {
        disbSql = `INSERT INTO payout_accounts (loan_id, type, mobile_phone, account_name, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
        disbParams = [applicationId, 'mobile_money', body.mm_phone_number, body.mm_registered_name];
      }

      if (disbSql) {
        await db.query(disbSql, disbParams);
      }
    }

    // Compute derived fields
    const age = computeAge(body.date_of_birth);
    const compliance = runComplianceChecks({ age, loan_amount: parseFloat(body.loan_amount), email: body.email });
    const credit = await fetchCreditReport({ age, requestedAmount: parseFloat(body.loan_amount) });
    const decision = decide({ amount: parseFloat(body.loan_amount), riskScore: credit.score, compliancePassed: compliance.passed });

    // Persist audit log
    await db.query(
      `INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, metadata_json, timestamp) VALUES (?,?,?,?,?, CURRENT_TIMESTAMP)`,
      [null, 'application_submitted', 'loan', applicationId, JSON.stringify({ compliance, credit, decision })]
    );

    res.status(201).json({ id: applicationId, compliance, credit, decision });
  } catch (err) {
    console.error('Application intake error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/applications/:id/decision - manual override
router.post('/:id/decision', requireRole(['admin', 'approver', 'underwriter']), async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { decision, reason } = req.body || {};
    if (!id || !decision) return res.status(400).json({ error: 'Missing id or decision' });
    await db.query(`INSERT INTO approval_stages (application_id, stage, decision, decided_by, decided_at, notes) VALUES (?,?,?,?, CURRENT_TIMESTAMP, ?)`, [id, 'manual_override', decision, req.userRole, reason || null]);
    await db.query(`INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, metadata_json, timestamp) VALUES (?,?,?,?,?, CURRENT_TIMESTAMP)`, [null, 'manual_decision', 'loan', id, JSON.stringify({ decision, reason })]);
    res.json({ success: true });
  } catch (err) {
    console.error('Manual decision error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

function computeAge(dobStr) {
  try {
    const d = new Date(dobStr);
    const diff = Date.now() - d.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  } catch (_) { return 0; }
}

module.exports = router;