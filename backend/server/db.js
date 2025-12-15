const mysql = require('mysql2/promise');

function getConfigFromUrl(urlStr) {
  try {
    const u = new URL(urlStr);
    return {
      host: u.hostname || 'localhost',
      port: u.port ? parseInt(u.port, 10) : 3306,
      user: decodeURIComponent(u.username || ''),
      password: decodeURIComponent(u.password || ''),
      database: (u.pathname || '/').replace(/^\//, '') || 'stronic_db'
    };
  } catch (e) {
    return {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'stronic_db'
    };
  }
}

// Initialize MySQL pool (will be used if MySQL is available)
let pool = null;
let sqliteDb = null;

function resolveDbUrl() {
  const isTest = process.env.NODE_ENV === 'test' || process.env.USE_TEST_DB === 'true';
  const testUrl = process.env.TEST_DATABASE_URL;
  const prodUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/stronic_db';
  return isTest && testUrl ? testUrl : prodUrl;
}

try {
  const cfg = getConfigFromUrl(resolveDbUrl());
  pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} catch (error) {
  console.warn('MySQL pool creation failed, will use SQLite fallback');
}

module.exports = {
  query: async (text, params) => {
    // Use SQLite if global flag is set
    if (global.useSQLite) {
      if (!sqliteDb) {
        sqliteDb = require('./db-sqlite');
      }

      try {
        const result = await sqliteDb.query(text, params);

        // Normalize result format to match MySQL
        if (Array.isArray(result)) {
          return { rows: result, rowCount: result.length };
        } else {
          return {
            rows: result,
            rowCount: result.changes || 0,
            insertId: result.insertId
          };
        }
      } catch (error) {
        console.error('SQLite query error:', error);
        throw error;
      }
    }

    // Use MySQL
    try {
      const [rows, fields] = await pool.execute(text, params);
      const rowCount = Array.isArray(rows) ? rows.length : (rows && rows.affectedRows) || 0;
      const insertId = rows && rows.insertId;
      return { rows, rowCount, insertId };
    } catch (error) {
      console.error('MySQL query error:', error);
      throw error;
    }
  },
  pool
};
