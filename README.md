Stronic Holdings — Local Website + Backend (Node.js + Express + MySQL)

This project serves the static website and provides backend APIs for loan applications, contact messages, and admin operations. It is intended for local development and testing.

Overview
- Static site served from the repo root (e.g., `index.html`, `services.html`, `admin.html`).
- Backend APIs under `http://localhost:3000/api/*`.
- MySQL database (via `mysql2`). Configure using `DATABASE_URL`.
- Admin authentication supports either API key (`x-admin-key`) or JWT (via `/api/admin/login`).

Prerequisites
- Node.js 16+ and npm.
- MySQL 8 (installed locally).

Simple Setup (Non‑Technical)
Follow these steps to run locally without Docker:
- Install MySQL Community Server (or MySQL via XAMPP) and ensure it’s running.
- Open PowerShell in the project folder.
- Copy the environment file: `Copy-Item .env.example .env`
- Start the app: `npm install` then `npm run start`
- Open the site: `http://localhost:3000/`
- Open the admin page: `http://localhost:3000/admin.html`
- On the admin page, paste `ADMIN_API_KEY` (`dev-admin-key-123456`) and click `Fetch`.
- If the admin table is empty, submit a loan from the site’s form or load sample data (see “Add Sample Data”).

Database URL (What to Put)
- Format: `mysql://<user>:<password>@<host>:<port>/<database>`
- Local MySQL examples:
  - No password: `mysql://root:@localhost:3306/stronic_db`
  - With password `root`: `mysql://root:root@localhost:3306/stronic_db`
Add this to `.env` as `DATABASE_URL`.

Environment Setup
1. Copy `.env.example` to `.env` and set values:
   - `ADMIN_API_KEY=dev-admin-key-123456`
   - `ADMIN_USER=admin`
   - `ADMIN_PASS=admin123!`
   - `JWT_SECRET=dev-secret-please-change`
   - `DATABASE_URL` (see examples above)

Add Sample Data (One‑Time)
If you want the admin page to show test loans and messages right away, import schema and sample data into your local MySQL:
- PowerShell (MySQL in PATH):
  - `mysql -u root -p stronic_db < server/schema.mysql.sql`
  - `mysql -u root -p stronic_db < server/sample-data.mysql.sql`
- MySQL Workbench (GUI):
  - Open MySQL Workbench and connect to your local server.
  - Create database `stronic_db` (Schemas → right‑click → Create Schema).
  - File → Open SQL Script → select `server/schema.mysql.sql` → click Execute.
  - File → Open SQL Script → select `server/sample-data.mysql.sql` → click Execute.

Quick Start (Local MySQL)
1. Create a database `stronic_db` in your local MySQL.
2. Load schema and sample data:
   - `mysql -u root -p stronic_db < server/schema.mysql.sql`
   - `mysql -u root -p stronic_db < server/sample-data.mysql.sql`
3. Install dependencies and run the server:
   - `npm install`
   - `npm run start` (or `npm run dev` for auto-reload)

Testing the Website
- Visit `http://localhost:3000/` for the marketing site.
- Visit `http://localhost:3000/admin.html` for the admin page.
- Authenticate on the admin page using one of:
  - API key: enter `ADMIN_API_KEY` and click `Fetch`.
  - JWT: enter `ADMIN_USER` / `ADMIN_PASS`, click `Login`, then `Fetch`.
- After authentication, loans are fetched from `/api/admin/loans`.

Notes for Windows users
- If `mysql` is not recognized, add MySQL `bin` to PATH or use MySQL Workbench.
- XAMPP users: ensure MySQL is started from the XAMPP Control Panel.

Admin API Reference (for quick checks)
- `POST /api/admin/login` → `{ token }`
  - Body: `{"username":"admin","password":"admin123!"}`
  - Use `Authorization: Bearer <token>` for subsequent requests.
- `GET /api/admin/loans?limit=25&page=1&q=test`
  - Headers: `x-admin-key: <ADMIN_API_KEY>` or `Authorization: Bearer <token>`
  - Returns `{ rows, page, limit, total }`
- `POST /api/admin/loans/:id/review`
  - Headers: same as above; optionally `x-admin-user` to set reviewer name.
- `GET /api/admin/contacts?limit=25&page=1&q=test`
  - Headers: same as above; returns `{ rows, page, limit, total }`

Notes
- File uploads are stored under `uploads/` for local development.
- Rate limiting is applied to all `/api/*` routes.
- If you change `.env`, restart the server to apply updates.

Common Pitfalls (Easy Fixes)
- Admin page shows empty rows: load sample data or submit a loan.
- `401 Unauthorized` on admin APIs: ensure you used API key or logged in with JWT.
- Database errors: check `DATABASE_URL` format and credentials.

Troubleshooting
- `401 Unauthorized` on admin APIs:
  - Ensure `.env` has `ADMIN_API_KEY`, `ADMIN_USER`, `ADMIN_PASS`, and `JWT_SECRET`.
  - Confirm requests include `x-admin-key` or `Authorization: Bearer <token>`.
- Empty admin tables:
  - Load `server/sample-data.mysql.sql` to seed test data.
- Database connection errors:
  - Verify `DATABASE_URL` matches your local MySQL instance and credentials.

Optional: Background Worker
- If you use `worker.js` for async processing, install and run Redis locally.
- Start: `node worker.js`

Smoke Tests
- The provided `smoke-test.ps1` and `smoke-test.sh` scripts were for the old Docker/PostgreSQL setup and are deprecated.
- Prefer the manual MySQL steps above. If needed, we can provide updated MySQL smoke-test scripts.
