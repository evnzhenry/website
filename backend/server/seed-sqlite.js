// Seed the local SQLite database with test admin data
const { initTables, query } = require('./db-sqlite');

async function seed() {
  try {
    await initTables();

    // Clear existing data
    await query('DELETE FROM contacts');
    await query('DELETE FROM loans');

    // Insert sample contacts
    const contacts = [
      ['Alice Johnson', 'alice@example.com', 'Inquiry about loan rates', 'Hello, I would like to know more about your personal loan rates.'],
      ['Bob Smith', 'bob@example.com', 'Application assistance', 'I started a loan application and need help with the document uploads.'],
      ['Chinedu Okafor', 'chinedu@example.com', 'Business loan question', 'Do you offer SME loans and what are the requirements?'],
      ['Diana Prince', 'diana@example.com', 'Repayment schedule', 'Can you share the repayment schedule for a 12-month loan?'],
      ['Ethan Hunt', 'ethan@example.com', 'Account update', 'I need to update my phone number on my loan application.'],
    ];

    for (const c of contacts) {
      await query('INSERT INTO contacts (name, email, subject, message) VALUES (?,?,?,?)', c);
    }

    // Insert sample loans
    const loans = [
      {
        full_name: 'Alice Johnson',
        date_of_birth: '1990-05-20',
        gender: 'Female',
        primary_phone: '+1-555-1000',
        secondary_phone: null,
        email: 'alice@example.com',
        emergency_name: 'Mark Johnson',
        emergency_relation: 'Brother',
        emergency_phone: '+1-555-9000',
        street_address: '123 Maple Street',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        national_id_file: 'alice_nid.pdf',
        photo_file: 'alice_photo.jpg',
        reviewed_by: null,
        reviewed_at: null,
        loan_amount: 5000.0,
        loan_purpose: 'Consolidate credit card debt',
      },
      {
        full_name: 'Bob Smith',
        date_of_birth: '1985-11-02',
        gender: 'Male',
        primary_phone: '+1-555-2000',
        secondary_phone: '+1-555-2001',
        email: 'bob@example.com',
        emergency_name: 'Karen Smith',
        emergency_relation: 'Spouse',
        emergency_phone: '+1-555-9001',
        street_address: '456 Oak Avenue',
        city: 'Denver',
        state: 'CO',
        zip_code: '80202',
        national_id_file: 'bob_nid.pdf',
        photo_file: 'bob_photo.jpg',
        reviewed_by: 'admin',
        reviewed_at: 'CURRENT_TIMESTAMP', // special flag handled below
        loan_amount: 15000.0,
        loan_purpose: 'Home improvement and emergency fund',
      },
      {
        full_name: 'Chinedu Okafor',
        date_of_birth: '1992-07-15',
        gender: 'Male',
        primary_phone: '+234-0803-123-4567',
        secondary_phone: null,
        email: 'chinedu@example.com',
        emergency_name: 'Ngozi Okafor',
        emergency_relation: 'Sister',
        emergency_phone: '+234-0803-765-4321',
        street_address: '12 Admiralty Way',
        city: 'Lagos',
        state: 'LA',
        zip_code: '100001',
        national_id_file: 'chinedu_nid.pdf',
        photo_file: 'chinedu_photo.jpg',
        reviewed_by: null,
        reviewed_at: null,
        loan_amount: 2500000.0,
        loan_purpose: 'SME working capital',
      },
      {
        full_name: 'Diana Prince',
        date_of_birth: '1988-03-10',
        gender: 'Female',
        primary_phone: '+1-555-3000',
        secondary_phone: null,
        email: 'diana@example.com',
        emergency_name: 'Steve Trevor',
        emergency_relation: 'Friend',
        emergency_phone: '+1-555-9002',
        street_address: '789 Pine Road',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94103',
        national_id_file: null,
        photo_file: null,
        reviewed_by: 'reviewer1',
        reviewed_at: 'CURRENT_TIMESTAMP', // special flag handled below
        loan_amount: 8000.0,
        loan_purpose: 'Relocation expenses',
      },
      {
        full_name: 'Ethan Hunt',
        date_of_birth: '1975-08-13',
        gender: 'Male',
        primary_phone: '+1-555-4000',
        secondary_phone: null,
        email: 'ethan@example.com',
        emergency_name: 'Benji Dunn',
        emergency_relation: 'Friend',
        emergency_phone: '+1-555-9003',
        street_address: '101 Mission Street',
        city: 'Boston',
        state: 'MA',
        zip_code: '02110',
        national_id_file: 'ethan_nid.pdf',
        photo_file: 'ethan_photo.jpg',
        reviewed_by: null,
        reviewed_at: null,
        loan_amount: 30000.0,
        loan_purpose: 'Business equipment purchase',
      },
    ];

    for (const l of loans) {
      if (l.reviewed_at === 'CURRENT_TIMESTAMP') {
        await query(
          'INSERT INTO loans (full_name, date_of_birth, gender, primary_phone, secondary_phone, email, emergency_name, emergency_relation, emergency_phone, street_address, city, state, zip_code, national_id_file, photo_file, reviewed_by, reviewed_at, loan_amount, loan_purpose) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, CURRENT_TIMESTAMP, ?,?)',
          [
            l.full_name,
            l.date_of_birth,
            l.gender,
            l.primary_phone,
            l.secondary_phone,
            l.email,
            l.emergency_name,
            l.emergency_relation,
            l.emergency_phone,
            l.street_address,
            l.city,
            l.state,
            l.zip_code,
            l.national_id_file,
            l.photo_file,
            l.reviewed_by,
            l.loan_amount,
            l.loan_purpose,
          ]
        );
      } else {
        await query(
          'INSERT INTO loans (full_name, date_of_birth, gender, primary_phone, secondary_phone, email, emergency_name, emergency_relation, emergency_phone, street_address, city, state, zip_code, national_id_file, photo_file, reviewed_by, reviewed_at, loan_amount, loan_purpose) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?,?)',
          [
            l.full_name,
            l.date_of_birth,
            l.gender,
            l.primary_phone,
            l.secondary_phone,
            l.email,
            l.emergency_name,
            l.emergency_relation,
            l.emergency_phone,
            l.street_address,
            l.city,
            l.state,
            l.zip_code,
            l.national_id_file,
            l.photo_file,
            l.reviewed_by,
            l.reviewed_at,
            l.loan_amount,
            l.loan_purpose,
          ]
        );
      }
    }

    const contactsCount = await query('SELECT COUNT(*) AS cnt FROM contacts');
    const loansCount = await query('SELECT COUNT(*) AS cnt FROM loans');
    console.log('Seed complete:', {
      contacts: contactsCount[0]?.cnt || 0,
      loans: loansCount[0]?.cnt || 0,
    });
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();