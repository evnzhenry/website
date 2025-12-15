-- MySQL schema for Stronic Holdings
CREATE TABLE IF NOT EXISTS loans (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(50) NOT NULL,
  primary_phone VARCHAR(50) NOT NULL,
  secondary_phone VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  emergency_name VARCHAR(255),
  emergency_relation VARCHAR(100),
  emergency_phone VARCHAR(50),
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  national_id_file VARCHAR(255),
  photo_file VARCHAR(255),
  reviewed_by VARCHAR(255),
  reviewed_at DATETIME,
  loan_amount DECIMAL(12,2) NOT NULL,
  loan_purpose TEXT,
  source VARCHAR(64),
  eligible TINYINT(1),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loans_email ON loans (email);
CREATE INDEX idx_loans_created_at ON loans (created_at);
CREATE INDEX idx_loans_source ON loans (source);

CREATE TABLE IF NOT EXISTS contacts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Payout accounts for borrowers to receive funds
CREATE TABLE IF NOT EXISTS payout_accounts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  loan_id BIGINT NOT NULL,
  type VARCHAR(32) NOT NULL,
  mobile_phone VARCHAR(50),
  bank_account_number VARCHAR(64),
  bank_code VARCHAR(32),
  bank_name VARCHAR(128),
  account_name VARCHAR(128),
  currency VARCHAR(3),
  verified TINYINT(1) DEFAULT 0,
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payout_accounts_loan FOREIGN KEY (loan_id) REFERENCES loans(id)
);

CREATE INDEX idx_payout_accounts_loan_id ON payout_accounts (loan_id);
CREATE INDEX idx_payout_accounts_type ON payout_accounts (type);
CREATE INDEX idx_payout_accounts_verified ON payout_accounts (verified);

-- Disbursements for loan payouts
CREATE TABLE IF NOT EXISTS disbursements (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  loan_id BIGINT NOT NULL,
  account_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  method VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'queued',
  provider_ref VARCHAR(128),
  error_reason TEXT,
  initiated_by VARCHAR(255),
  idempotency_key VARCHAR(128) UNIQUE,
  approved_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_disbursements_loan FOREIGN KEY (loan_id) REFERENCES loans(id),
  CONSTRAINT fk_disbursements_account FOREIGN KEY (account_id) REFERENCES payout_accounts(id)
);

CREATE INDEX idx_disbursements_loan_id ON disbursements (loan_id);
CREATE INDEX idx_disbursements_account_id ON disbursements (account_id);
CREATE INDEX idx_disbursements_status ON disbursements (status);
CREATE INDEX idx_disbursements_created_at ON disbursements (created_at);