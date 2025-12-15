// Simple RBAC middleware with API key and optional Clerk JWT support
const jwt = require('jsonwebtoken');

function getRoleFromReq(req) {
  // Admin via API key
  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey && req.headers['x-admin-api-key'] === adminKey) return 'admin';

  // Optional JWT (Clerk or custom) in Authorization: Bearer
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (token && process.env.JWT_SECRET) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      return payload.role || 'user';
    } catch (_) {
      // ignore
    }
  }
  return 'public';
}

function requireRole(required) {
  const allowed = Array.isArray(required) ? required : [required];
  return (req, res, next) => {
    const role = getRoleFromReq(req);
    if (!allowed.includes(role)) {
      return res.status(403).json({ error: 'Forbidden', role });
    }
    req.userRole = role;
    next();
  };
}

module.exports = { getRoleFromReq, requireRole };