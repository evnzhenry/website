const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyDocument } = require('../lib/ocr');
const db = require('../db');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/documents/verify - upload and run OCR/verification
router.post('/verify', upload.single('document'), async (req, res) => {
  try {
    const applicationId = parseInt(req.body.application_id, 10);
    const type = req.body.type || 'unknown';
    const filePath = req.file && req.file.path;
    if (!applicationId || !filePath) return res.status(400).json({ error: 'application_id and document file required' });
    const vr = await verifyDocument({ filePath, type });
    await db.query(`INSERT INTO documents (application_id, type, file_path, mime, checksum, verified_status, uploaded_at) VALUES (?,?,?,?,?,?, CURRENT_TIMESTAMP)`, [applicationId, type, filePath, req.file.mimetype, null, vr.verified ? 'verified' : 'unverified']);
    await db.query(`INSERT INTO audit_logs (actor_user_id, action, resource_type, resource_id, metadata_json, timestamp) VALUES (?,?,?,?,?, CURRENT_TIMESTAMP)`, [null, 'document_uploaded', 'loan', applicationId, JSON.stringify({ type, filePath, ocr: vr })]);
    res.json({ success: true, result: vr });
  } catch (err) {
    console.error('Document verify error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;