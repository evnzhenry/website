const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const db = require('../db');

// Simple test auth: require x-test-key or Bearer token matching TEST_API_KEY
function requireTestAuth(req, res, next) {
  const headerKey = req.headers['x-test-key'];
  const auth = req.headers['authorization'] || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : null;
  const expected = process.env.TEST_API_KEY || '';
  if (!expected) return res.status(500).json({ error: 'TEST_API_KEY not configured' });
  if (headerKey === expected || bearer === expected) return next();
  return res.status(401).json({ error: 'Unauthorized: invalid test key' });
}

// Local metrics for monitoring
const metrics = {
  submittedSuccess: 0,
  submittedError: 0,
  retrievals: 0,
  lastError: null,
  submitAvgMs: 0,
  submitMaxMs: 0,
  retrieveAvgMs: 0,
  retrieveMaxMs: 0,
};

function updateAvg(prevAvg, sampleMs) {
  return prevAvg === 0 ? sampleMs : (prevAvg * 0.9 + sampleMs * 0.1);
}

// POST /api/test-data/submit
router.post(
  '/submit',
  requireTestAuth,
  [
    body('type').isString().trim().notEmpty(),
    body('data').isObject(),
    body('status').optional().isString().isIn(['received', 'validated', 'stored', 'failed']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      metrics.submittedError += 1;
      metrics.lastError = { at: new Date().toISOString(), reason: 'validation', details: errors.array() };
      return res.status(400).json({ errors: errors.array() });
    }

    const start = process.hrtime.bigint();
    try {
      const { type, data } = req.body;
      const status = req.body.status || 'received';
      const payload = JSON.stringify(data);

      // Insert into test_records with timestamp
      const q = `INSERT INTO test_records (type, payload, status, created_at) VALUES (?,?,?, CURRENT_TIMESTAMP)`;
      const result = await db.query(q, [type, payload, status]);

      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      metrics.submittedSuccess += 1;
      metrics.submitAvgMs = updateAvg(metrics.submitAvgMs, ms);
      metrics.submitMaxMs = Math.max(metrics.submitMaxMs, ms);

      return res.status(201).json({ id: result.insertId, type, status, created_at: new Date().toISOString() });
    } catch (e) {
      const ms = Number(process.hrtime.bigint() - start) / 1e6;
      metrics.submittedError += 1;
      metrics.submitAvgMs = updateAvg(metrics.submitAvgMs, ms);
      metrics.submitMaxMs = Math.max(metrics.submitMaxMs, ms);
      metrics.lastError = { at: new Date().toISOString(), reason: 'db', message: e.message };
      return res.status(500).json({ error: 'Database insert failed', detail: e.message });
    }
  }
);

// Utility: Build WHERE clauses for filters
function buildFilters({ type, status, start, end, q }) {
  const where = [];
  const params = [];
  if (type) { where.push('type = ?'); params.push(type); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (start) { where.push('created_at >= ?'); params.push(start); }
  if (end) { where.push('created_at <= ?'); params.push(end); }
  if (q) { where.push('payload LIKE ?'); params.push(`%${q}%`); }
  const sql = where.length ? ('WHERE ' + where.join(' AND ')) : '';
  return { sql, params };
}

function toXml(rows) {
  const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const items = rows.map(r => `  <record id="${esc(r.id)}" type="${esc(r.type)}" status="${esc(r.status)}" created_at="${esc(r.created_at)}">\n    <payload>${esc(r.payload)}</payload>\n  </record>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<records>\n${items}\n</records>`;
}

// GET /api/test-data/records
router.get(
  '/records',
  requireTestAuth,
  [
    query('type').optional().isString(),
    query('status').optional().isString(),
    query('start').optional().isISO8601(),
    query('end').optional().isISO8601(),
    query('q').optional().isString(),
    query('format').optional().isIn(['json','xml']),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const startT = process.hrtime.bigint();
    try {
      const { type, status, start, end, q } = req.query;
      const format = (req.query.format || 'json').toLowerCase();
      const limit = parseInt(req.query.limit || '25', 10);
      const page = parseInt(req.query.page || '1', 10);
      const offset = (page - 1) * limit;

      const { sql, params } = buildFilters({ type, status, start, end, q });
      const rowsRes = await db.query(`SELECT id, type, status, payload, created_at FROM test_records ${sql} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
      const countRes = await db.query(`SELECT COUNT(*) AS cnt FROM test_records ${sql}`, params);
      const total = Array.isArray(countRes.rows) ? (countRes.rows[0].cnt || countRes.rows[0]['COUNT(*)'] || 0) : 0;

      const ms = Number(process.hrtime.bigint() - startT) / 1e6;
      metrics.retrievals += 1;
      metrics.retrieveAvgMs = updateAvg(metrics.retrieveAvgMs, ms);
      metrics.retrieveMaxMs = Math.max(metrics.retrieveMaxMs, ms);

      const rows = rowsRes.rows || [];
      if (format === 'xml') {
        res.setHeader('Content-Type', 'application/xml');
        return res.status(200).send(toXml(rows));
      }
      return res.status(200).json({ rows, page, limit, total });
    } catch (e) {
      metrics.lastError = { at: new Date().toISOString(), reason: 'db', message: e.message };
      return res.status(500).json({ error: 'Database query failed', detail: e.message });
    }
  }
);

// GET /api/test-data/metrics
router.get('/metrics', requireTestAuth, (req, res) => {
  res.json({
    submittedSuccess: metrics.submittedSuccess,
    submittedError: metrics.submittedError,
    retrievals: metrics.retrievals,
    submitAvgMs: Number(metrics.submitAvgMs.toFixed(2)),
    submitMaxMs: Number(metrics.submitMaxMs.toFixed(2)),
    retrieveAvgMs: Number(metrics.retrieveAvgMs.toFixed(2)),
    retrieveMaxMs: Number(metrics.retrieveMaxMs.toFixed(2)),
    lastError: metrics.lastError,
  });
});

module.exports = router;