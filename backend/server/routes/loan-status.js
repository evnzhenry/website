const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/loan-status/check - Check status by email (no OTP)
router.post('/check', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Query to get loan details, approval status, and payout info
    const query = `
      SELECT 
        l.id, 
        l.loan_amount, 
        l.loan_purpose, 
        l.created_at,
        l.reviewed_at,
        aps.decision AS approval_status,
        aps.decided_at,
        d.status AS disbursement_status,
        d.created_at AS disbursement_queued_at,
        pa.type AS payout_type,
        pa.bank_name,
        pa.bank_account_number,
        pa.mobile_phone,
        pa.account_name
      FROM loans l
      LEFT JOIN (
        SELECT application_id, decision, decided_at
        FROM approval_stages
        WHERE id IN (SELECT MAX(id) FROM approval_stages GROUP BY application_id)
      ) aps ON aps.application_id = l.id
      LEFT JOIN payout_accounts pa ON pa.loan_id = l.id
      LEFT JOIN disbursements d ON d.loan_id = l.id
      WHERE l.email = ?
      ORDER BY l.created_at DESC
    `;

    const result = await db.query(query, [email]);

    if (!result.rows || result.rows.length === 0) {
      return res.json({
        success: true,
        applications: []
      });
    }

    // Process results to add derived fields
    const applications = result.rows.map(app => {
      let status = 'Submitted';
      let disbursementDate = null;

      if (app.disbursement_status === 'completed') {
        status = 'Disbursed';
        disbursementDate = app.disbursement_queued_at; // Or updated_at if available
      } else if (app.disbursement_status === 'queued' || app.disbursement_status === 'processing') {
        status = 'Disbursement In Progress';
        disbursementDate = app.disbursement_queued_at;
      } else if (app.approval_status === 'approved') {
        status = 'Approved';
        // Estimated disbursement: 24 hours after approval
        const approvalDate = new Date(app.decided_at);
        approvalDate.setHours(approvalDate.getHours() + 24);
        disbursementDate = approvalDate;
      } else if (app.approval_status === 'rejected') {
        status = 'Rejected';
      } else if (app.reviewed_at) {
        status = 'Under Review';
      }

      return {
        id: app.id,
        loan_amount: app.loan_amount,
        loan_purpose: app.loan_purpose,
        created_at: app.created_at,
        status,
        disbursement_date: disbursementDate,
        payout_details: {
          type: app.payout_type,
          bank_name: app.bank_name,
          account_number: app.bank_account_number,
          mobile_phone: app.mobile_phone,
          account_name: app.account_name
        }
      };
    });

    res.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('Error checking loan status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;