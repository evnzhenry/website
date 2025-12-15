# Website Development Plan

This document outlines clear requirements, architecture decisions, implementation steps, testing and quality, deployment, and post-launch operations tailored to this project (Next.js frontend, Express backend, MySQL with SQLite fallback).

## 1. Requirements & Specifications
- Functional scope
  - Public site: Home, About, Services (and service details), Contact, Eligibility, Loan Status.
  - Admin: Authenticated dashboard to review loan applications and contact messages.
  - Forms: Contact form, Loan application, Loan status (OTP email-based) — already partially implemented.
- User stories
  - As an applicant, I can submit a loan application and receive status updates.
  - As a visitor, I can contact support via a form and receive confirmation.
  - As an admin, I can authenticate and review applications and contacts with search and pagination.
- Non-functional requirements
  - Accessibility (WCAG AA contrast and keyboard navigation).
  - Performance budgets: LCP ≤ 2.5s, TTI ≤ 3s on mid-tier devices.
  - Security: Input validation, rate limiting, server-side auth guards, secrets managed via env.
- Deliverables
  - Responsive UI across breakpoints (mobile, tablet, desktop).
  - Active navigation states and accessible focus styles (implemented in Header).
  - Documentation covering setup, testing, deployment, and operations.

## 2. Architecture & Stack Decisions
- Frontend: Next.js 15 (App Router), React 19 — served on port 3000.
  - Rewrites `/api/*` to backend `http://localhost:4000` as configured in `next.config.ts`.
  - Middleware guards `/admin` via Clerk when keys are present.
- Backend: Node.js + Express, REST APIs under `/api/*` on port 4000.
  - Database: Primary MySQL via `mysql2`; fallback SQLite in dev/test.
  - Rate limiting and CORS in place; uploads served from `/uploads`.
- Data model overview
  - `loans`, `contacts`, `payout_accounts`, `disbursements` (MySQL schemas).
  - `test_records` for structured test data (JSON in MySQL, TEXT in SQLite).
- Config & environments
  - `.env` values: `DATABASE_URL`, `TEST_DATABASE_URL`, `TEST_API_KEY`, `ADMIN_API_KEY`, `JWT_SECRET`.
  - Test DB selected when `NODE_ENV=test` or `USE_TEST_DB=true`.

## 3. Core Functionality Implementation Plan
- Pages & navigation
  - Ensure a responsive layout and accessible navbar with active states.
  - Confirm Services dropdown behavior and touch-friendly interactions.
- Features
  - Contact form: client-side validation; backend route `/api/contacts` using nodemailer optionally.
  - Loan application: multi-step or single form; server-side validation; file uploads; admin review.
  - Loan status: OTP email flow via `/api/loan-status` (already implemented) with robust rate limiting.
  - Admin dashboard: Clerk-based or API-key/JWT; pagination, filtering, bulk actions.
- Content management
  - Use static JSON/YAML or headless CMS later; initially edit content in repo.

## 4. Quality & Performance
- Testing strategy
  - Unit tests: validators, helpers.
  - Integration tests: API endpoints (`jest` + `supertest`) — initial tests added for `/api/test-data`.
  - UI tests: Playwright for critical flows (contact submission, application).
- Performance improvements
  - Optimize images (consider Next Image with proper loader; currently `unoptimized: true`).
  - Bundle analysis, code-splitting, SSR caching of static data.
- Security practices
  - HTTPS in production, strict CORS, input validation (`express-validator`), auth on admin, secrets in env.
- Monitoring & error tracking
  - Backend: request metrics and `/api/test-data/metrics`.
  - Consider Sentry or similar for frontend/backend exceptions.

## 5. Deployment & Operations
- Hosting
  - Frontend (Next.js) and Backend (Express) deployed separately; set `API_BASE_URL` for rewrites.
- CI/CD
  - GitHub Actions: lint, test, build; deploy on main merges.
- Backup & recovery
  - Nightly MySQL dumps; uploads backup; versioned releases.
- Maintenance
  - Semantic versioning; changelog; scheduled dependency updates.

## 6. Launch & Post-Launch
- Pre-launch checklist
  - Accessibility audit, performance audit, security headers validation, cross-browser testing.
- Analytics & tracking
  - Integrate privacy-friendly analytics; define key events (form submissions, status checks).
- Documentation & training
  - Admin guide for reviewing applications and messages.
- Feedback & iteration
  - Collect user feedback via contact forms and analytics; prioritize roadmap updates.

## 7. Execution Roadmap (High-Level)
- Week 1: Finalize requirements, polish navbar/UI, integrate contact form fully.
- Week 2: Loan application improvements, admin review workflows, status flow hardening.
- Week 3: Testing coverage, performance tuning, monitoring, CI pipeline.
- Week 4: Deployment setup, backups, launch readiness, post-launch analytics.

---

References
- `backend/server.js` initializes DBs and mounts routes
- `backend/server/db.js` and `db-sqlite.js` handle DB connections and test switching
- `frontend/next.config.ts` proxies API calls to backend
- `docs/testing.md` explains the comprehensive testing environment and endpoints