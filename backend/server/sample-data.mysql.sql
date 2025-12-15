-- Sample data for Stronic Holdings (MySQL)
-- Ensure you have run server/schema.mysql.sql first.
-- Optionally set the database:
-- USE stronic_db;

-- Clear existing data (optional)
TRUNCATE TABLE contacts;
TRUNCATE TABLE loans;

-- Insert sample contacts
INSERT INTO contacts (name, email, subject, message)
VALUES
  ('Alice Johnson', 'alice@example.com', 'Inquiry about loan rates', 'Hello, I would like to know more about your personal loan rates.'),
  ('Bob Smith', 'bob@example.com', 'Application assistance', 'I started a loan application and need help with the document uploads.'),
  ('Chinedu Okafor', 'chinedu@example.com', 'Business loan question', 'Do you offer SME loans and what are the requirements?'),
  ('Diana Prince', 'diana@example.com', 'Repayment schedule', 'Can you share the repayment schedule for a 12-month loan?'),
  ('Ethan Hunt', 'ethan@example.com', 'Account update', 'I need to update my phone number on my loan application.');

-- Insert sample loans
INSERT INTO loans (
  full_name,
  date_of_birth,
  gender,
  primary_phone,
  secondary_phone,
  email,
  emergency_name,
  emergency_relation,
  emergency_phone,
  street_address,
  city,
  state,
  zip_code,
  national_id_file,
  photo_file,
  reviewed_by,
  reviewed_at,
  loan_amount,
  loan_purpose
) VALUES
  (
    'Alice Johnson',
    '1990-05-20',
    'Female',
    '+1-555-1000',
    NULL,
    'alice@example.com',
    'Mark Johnson',
    'Brother',
    '+1-555-9000',
    '123 Maple Street',
    'Austin',
    'TX',
    '78701',
    'alice_nid.pdf',
    'alice_photo.jpg',
    NULL,
    NULL,
    5000.00,
    'Consolidate credit card debt'
  ),
  (
    'Bob Smith',
    '1985-11-02',
    'Male',
    '+1-555-2000',
    '+1-555-2001',
    'bob@example.com',
    'Karen Smith',
    'Spouse',
    '+1-555-9001',
    '456 Oak Avenue',
    'Denver',
    'CO',
    '80202',
    'bob_nid.pdf',
    'bob_photo.jpg',
    'admin',
    NOW(),
    15000.00,
    'Home improvement and emergency fund'
  ),
  (
    'Chinedu Okafor',
    '1992-07-15',
    'Male',
    '+234-0803-123-4567',
    NULL,
    'chinedu@example.com',
    'Ngozi Okafor',
    'Sister',
    '+234-0803-765-4321',
    '12 Admiralty Way',
    'Lagos',
    'LA',
    '100001',
    'chinedu_nid.pdf',
    'chinedu_photo.jpg',
    NULL,
    NULL,
    2500000.00,
    'SME working capital'
  ),
  (
    'Diana Prince',
    '1988-03-10',
    'Female',
    '+1-555-3000',
    NULL,
    'diana@example.com',
    'Steve Trevor',
    'Friend',
    '+1-555-9002',
    '789 Pine Road',
    'San Francisco',
    'CA',
    '94103',
    NULL,
    NULL,
    'reviewer1',
    NOW(),
    8000.00,
    'Relocation expenses'
  ),
  (
    'Ethan Hunt',
    '1975-08-13',
    'Male',
    '+1-555-4000',
    NULL,
    'ethan@example.com',
    'Benji Dunn',
    'Friend',
    '+1-555-9003',
    '101 Mission Street',
    'Boston',
    'MA',
    '02110',
    'ethan_nid.pdf',
    'ethan_photo.jpg',
    NULL,
    NULL,
    30000.00,
    'Business equipment purchase'
  );

-- Verify sample insert counts
SELECT COUNT(*) AS contacts_count FROM contacts;
SELECT COUNT(*) AS loans_count FROM loans;