# Digital Loan Management System Blueprint

## Overview
- End-to-end lifecycle: application → approval → origination → payments → ongoing management → closure.
- Modular architecture built on existing Next.js frontend and Node/Express backend in this repo.
- Secure, compliant, auditable; integrates with payment gateways and credit bureaus; exposes APIs for partners.

## Architecture
- Frontend: `Next.js` app (responsive, client components for forms, admin dashboard), Clerk-based auth with RBAC.
- Backend: `Node.js/Express` with layered services (`routes`, `middleware`, `lib`). Real-time updates via SSE.
- Database: Start with `SQLite/MySQL/Postgres` (existing SQLite for dev). Use migrations and schema versioning.
- Storage: Local `uploads/` for dev; abstract to S3-compatible storage in prod.
- Integrations: Credit bureaus (REST/SOAP), payment gateway (card/ACH), core banking (loan ledger sync).
- Security: Clerk JWT auth, HTTPS-only, PII encryption at rest (field-level), role policies enforced server-side.
- Observability: Centralized audit logs, structured app logs, metrics dashboards.

## Data Model (key entities)
- Applicant: `id`, `full_name`, `email`, `phone`, `address`, `national_id`, `kyc_status`, `created_at`.
- LoanApplication: `id`, `applicant_id`, `amount`, `purpose`, `term_months`, `repayment_freq`, `status` (draft, submitted, under_review, approved, rejected), `risk_score`, `created_at`, `updated_at`.
- Document: `id`, `application_id`, `type` (photo, id, bank_statement, income_proof), `file_path`, `mime`, `checksum`, `verified_status`, `uploaded_at`.
- User: `id`, `clerk_user_id`, `role` (officer, underwriter, approver, admin), `created_at`.
- ApprovalStage: `id`, `application_id`, `stage` (officer_review, underwriting, approval_committee), `decision` (pending, approve, reject, revise), `decided_by`, `decided_at`, `notes`.
- AuditLog: `id`, `actor_user_id`, `action`, `resource_type`, `resource_id`, `timestamp`, `metadata_json`.
- Loan: `id`, `application_id`, `principal`, `rate_apr`, `term_months`, `origination_date`, `maturity_date`, `status`.
- PaymentSchedule: `id`, `loan_id`, `due_date`, `amount_due`, `status` (scheduled, paid, overdue), `paid_at`, `transaction_id`.
- Delinquency: `id`, `loan_id`, `days_past_due`, `bucket` (30/60/90+), `actions_json`, `notified_at`.
- CreditReport: `id`, `application_id`, `bureau_name`, `score`, `report_url`, `pulled_at`.

## API Surface (REST)
- Applications: `POST /api/applications`, `GET /api/applications`, `GET /api/applications/:id`, `PATCH /api/applications/:id`.
- Documents: `POST /api/applications/:id/documents` (file upload, type validation), `GET /api/applications/:id/documents`.
- Approval Workflow: `GET /api/workflow/config`, `POST /api/applications/:id/stages/:stage/decision`, `GET /api/applications/:id/stages`.
- Credit Scoring: `POST /api/applications/:id/credit-report`, `GET /api/applications/:id/credit-report`.
- Origination & Loans: `POST /api/applications/:id/originate`, `GET /api/loans`, `GET /api/loans/:id`.
- Payments: `POST /api/loans/:id/schedule`, `POST /api/loans/:id/payments`, `GET /api/loans/:id/payments`.
- Delinquency: `GET /api/delinquencies`, `POST /api/delinquencies/:id/actions`.
- Reporting: `GET /api/reports/portfolio`, `GET /api/reports/exports` (CSV/JSON/PDF).
- Audit Logs: `GET /api/audit` (role-restricted), supports filters.

## Workflow & Rules
- Multi-stage approval with configurable rules: JSON/YAML policies (e.g., `rules/*.yaml`) for thresholds, risk bands, auto-approval/decline conditions.
- Real-time eligibility checks on application form: client calls `GET /api/eligibility?amount=...&term=...` for immediate feedback.
- Role-based actions: officers can triage; underwriters assign scores; approvers make final decision.
- Audit trail: every decision/action recorded to `AuditLog`.

## UI Features
- Application Form: multi-step wizard, validation, autosave drafts (local & server), document upload with type/mime checks.
- Admin Dashboard: tabs for Applications, Loans, Messages; filters, sorting, bulk actions; detail view with documents and actions.
- Payments & Delinquency: schedule viewer, payment posting UI, overdue alerting and actions.
- Reporting: portfolio performance, exports, drill-downs.

## Security & Compliance
- Authentication: Clerk JWT; backend verifies and maps to `User` + `role`.
- Authorization: server-side RBAC middleware; least privilege; audit on denials.
- Encryption: TLS in transit; at rest for sensitive PII fields; key rotation policy.
- Logging: structured logs with request IDs; immutable `AuditLog` for compliance.
- Privacy: consent capture, data minimization, retention & deletion policies; configurable per jurisdiction (e.g., GDPR/CCPA).
- Regulatory: KYC/AML workflow hooks; adverse action notices; explainable risk scoring; configurable disclosures.

## Integration Points
- Credit Bureau: adapter `lib/credit-bureau.ts` with mock + provider-specific drivers.
- Payments: adapter `lib/payments-gateway.ts` for card/ACH; webhooks for settlement and reconciliation.
- Core Banking: `lib/core-banking.ts` for loan ledger sync and status reconciliation.

## Implementation Plan (phased)
1) Foundations: RBAC middleware, audit logging, schema migrations, document upload validation; Clerk end-to-end on admin.
2) Applications & Workflow: eligibility endpoint, multi-step form with autosave, rules engine, approval stages UI + APIs.
3) Loans & Payments: origination, schedules, payment posting, delinquency handling, alerts and SSE updates.
4) Reporting & Integrations: portfolio analytics, exports, credit bureau adapter, payment gateway integration, core banking sync.

## Repo Mapping & Tasks
- Backend paths: `server/middleware/rbac.js`, `server/lib/rules-engine.js`, `server/lib/credit-bureau.js`, `server/lib/payments-gateway.js`, `server/routes/applications.js`, `server/routes/loans.js`, `server/routes/reports.js`.
- Frontend: new pages/components for wizarded application, approvals UI, payments tools; reuse `/admin` with Clerk guards.
- Env vars: `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `PAYMENTS_API_KEY`, `CREDIT_BUREAU_API_KEY`, `CORE_BANKING_URL`.

## Testing & Validation
- Unit tests for rules engine, RBAC, document validation.
- Integration tests for API routes and workflows.
- Security tests: authz bypass attempts, PII access, injection resistance.
- Regulatory checklist validation per target jurisdiction(s).