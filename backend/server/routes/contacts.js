const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require('nodemailer');
const events = require('../lib/events');

let mailTransport = null;
if (process.env.SMTP_HOST) {
  mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

    const q = `INSERT INTO contacts (name, email, subject, message, created_at) VALUES (?,?,?, ?, CURRENT_TIMESTAMP)`;
    const values = [name, email, subject || null, message];
    const result = await db.query(q, values);

    // Broadcast contact.created for admin SSE
    try {
      events.emit('contact.created', {
        id: result.insertId,
        name,
        email,
        subject: subject || null,
        created_at: new Date().toISOString()
      });
    } catch (e) { /* non-blocking */ }

    // send notification to site admin asynchronously
    if (mailTransport && process.env.ADMIN_NOTIFICATION_EMAIL) {
      mailTransport.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@stronicholdings.com',
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: `New contact message from ${name}`,
        text: `New message:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || 'n/a'}\n\n${message}`
      }).catch(err => console.error('Failed to send contact notification', err));
    }

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
