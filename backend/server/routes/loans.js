const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { loanValidation } = require('../middleware/validators');
const { validationResult } = require('express-validator');
const storageLib = require('../lib/storage');
const nodemailer = require('nodemailer');
const events = require('../lib/events');

// Nodemailer transport (if configured)
let mailTransport = null;
if (process.env.SMTP_HOST) {
  mailTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
}

// Store uploads in ./uploads (ensure write permissions)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/loans - submit loan application
router.post('/', upload.fields([{ name: 'nationalId' }, { name: 'photo' }]), loanValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const files = req.files || {};
    const body = req.body || {};

    const nationalIdFile = files.nationalId && files.nationalId[0] ? files.nationalId[0].filename : null;
    const photoFile = files.photo && files.photo[0] ? files.photo[0].filename : null;

    // Optional attribution fields
    const source = body.source ? String(body.source).slice(0, 64) : null;
    const eligibleFlag = typeof body.eligible === 'string' ? (body.eligible.toLowerCase() === 'true' ? 1 : 0) : (body.eligible ? 1 : 0);

    const insertQuery = `
      INSERT INTO loans (
        full_name, date_of_birth, gender, primary_phone, secondary_phone, email,
        emergency_name, emergency_relation, emergency_phone,
        street_address, city, state, zip_code,
        national_id_file, photo_file,
        reviewed_by, reviewed_at,
        loan_amount, loan_purpose,
        source, eligible
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      body.fullName,
      body.dateOfBirth,
      body.gender,
      body.primaryPhone,
      body.secondaryPhone || null,
      body.email,
      body.emergencyName || null,
      body.emergencyRelation || null,
      body.emergencyPhone || null,
      body.streetAddress,
      body.city,
      body.state,
      body.zipCode,
      nationalIdFile,
      photoFile,
      null,
      null,
      body.loanAmount,
      body.loanPurpose,
      source,
      eligibleFlag
    ];

    const result = await db.query(insertQuery, values);
    const id = result.insertId;

    // Send confirmation email asynchronously if transport configured
    if (mailTransport) {
      mailTransport.sendMail({
        from: process.env.EMAIL_FROM || 'no-reply@stronicholdings.com',
        to: body.email,
        subject: 'Stronic Holdings - Loan Application Received',
        text: `Dear ${body.fullName},\n\nWe have received your loan application. Your reference number is SH${id}. We will contact you within 24-48 hours.\n\nRegards,\nStronic Holdings`
      }).catch(err => console.error('Email send failed', err));
    }

    // Emit real-time event for admins
    try {
      events.emit('loan.created', {
        id,
        full_name: body.fullName,
        email: body.email,
        loan_amount: body.loanAmount,
        source,
        eligible: eligibleFlag,
        created_at: new Date().toISOString()
      });
    } catch (e) { /* non-blocking */ }

    res.json({ success: true, id, reference: `SH${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
