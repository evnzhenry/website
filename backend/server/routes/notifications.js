const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { buildTemplate } = require('../lib/templates/notifications');

let transport = null;
if (process.env.SMTP_HOST) {
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

// POST /api/notifications/send
router.post('/send', async (req, res) => {
  try {
    const { type, to, data } = req.body || {};
    if (!type || !to) return res.status(400).json({ error: 'type and to required' });
    const text = buildTemplate(type, data || {});
    if (transport) {
      await transport.sendMail({ from: process.env.SMTP_FROM || 'no-reply@stronicholdings.com', to, subject: 'Loan Update', text });
      return res.json({ success: true, sent: true });
    }
    res.json({ success: true, sent: false, preview: text });
  } catch (err) {
    console.error('Notification send error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;