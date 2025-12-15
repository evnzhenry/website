# Comprehensive Testing Guide

This guide explains how to prepare and run a dedicated testing environment to validate data handling and database operations end-to-end.

## Overview
- Separate test database (`TEST_DATABASE_URL` or SQLite `stronic_test.db`).
- Authenticated test endpoints under `POST /api/test-data/submit` and `GET /api/test-data/records`.
- Server-side validation, timestamped inserts, error logging.
- Retrieval supports filters, pagination, and JSON/XML output.
- Monitoring via `GET /api/test-data/metrics` for operation counts and timings.

## Setup
1. Copy env file:
   - `Copy-Item .env.example backend\.env` (Windows PowerShell)
2. Edit `backend/.env`:
   - `DATABASE_URL` → production/dev DB.
   - `TEST_DATABASE_URL` → separate test DB (e.g., `mysql://root:@localhost:3306/stronic_test_db`).
   - `TEST_API_KEY` → a secret key for test endpoints.
3. Choose test mode:
   - Set `NODE_ENV=test` or `USE_TEST_DB=true` in `backend/.env` to use the test DB.
4. Install dependencies and start backend:
   - `cd backend`
   - `npm install`
   - `npm run dev` (defaults to port `4000` via `start-dev.bat`).

## Endpoints

### Submit Test Data
`POST /api/test-data/submit`
- Headers: `x-test-key: <TEST_API_KEY>` or `Authorization: Bearer <TEST_API_KEY>`
- Body (JSON):
```json
{
  "type": "loan_application",
  "data": { "example": "value" },
  "status": "received" // optional
}
```
- Behavior:
  - Validates `type` and `data`.
  - Inserts into `test_records` with server timestamp.
  - Returns `{ id, type, status, created_at }`.

### Retrieve Records
`GET /api/test-data/records`
- Headers: `x-test-key: <TEST_API_KEY>` or Bearer token.
- Query params:
  - `type` (string), `status` (string)
  - `start`, `end` (ISO datetime)
  - `q` (substring match within payload)
  - `limit` (1–100, default 25), `page` (>=1)
  - `format` (`json` or `xml`, default `json`)
- Returns:
  - JSON: `{ rows, page, limit, total }`
  - XML: `<records><record ...><payload>...</payload></record>...</records>`

### Metrics
`GET /api/test-data/metrics`
- Tracks: successful/failed submissions, retrievals, average and max DB timings, last error details.

## Test Cases (Manual)
- End-to-end: Submit → Retrieve → Verify `rows[0].payload` and timestamps.
- Data integrity: Verify payload matches submission; types and statuses preserved.
- Performance: Observe `submitAvgMs` and `retrieveAvgMs` under metrics; adjust load.
- Error handling: Submit invalid payloads, missing auth, and observe detailed errors.

## Automated Tests (Optional)
- Add `NODE_ENV=test`, set `TEST_DATABASE_URL`, and run backend.
- We provide integration tests using Supertest in `backend/tests/test-data.test.js`.
  - `cd backend && npm test`
  - Ensures submission, retrieval, and error cases pass.

## Expected Outcomes
- Valid submissions return `201` with new record ID.
- Retrieval returns paginated results with filters applied.
- Metrics reflect operation counts and timings accurately.
- Errors include descriptive messages and validation details.

## Troubleshooting
- `401 Unauthorized`: Ensure `TEST_API_KEY` is set and sent.
- DB errors: Verify `TEST_DATABASE_URL` and that MySQL is running; server will auto-create schema and tables.
- SQLite mode: Set `USE_TEST_DB=true` to use `stronic_test.db` automatically.