const request = require('supertest');
const { app, initDatabase } = require('../server');
const path = require('path');
const fs = require('fs');

// Create a dummy file for upload testing
const dummyFilePath = path.join(__dirname, 'dummy.jpg');
if (!fs.existsSync(dummyFilePath)) {
    fs.writeFileSync(dummyFilePath, 'dummy image content');
}

describe('Loan Application Flow', () => {
    beforeAll(async () => {
        // Initialize DB (SQLite fallback likely in test env)
        await initDatabase();
    });

    afterAll(() => {
        // Clean up dummy file
        if (fs.existsSync(dummyFilePath)) {
            fs.unlinkSync(dummyFilePath);
        }
    });

    it('should submit a loan application with disbursement details', async () => {
        const payload = {
            full_name: 'Test User',
            email: 'test@example.com',
            primary_phone: '0700000000',
            date_of_birth: '1990-01-01',
            loan_amount: 50000,
            loan_purpose: 'Testing',
            disbursement_method: 'mobile_money',
            mm_phone_number: '0700000000',
            mm_registered_name: 'Test User MM'
        };

        const res = await request(app)
            .post('/api/applications')
            .send(payload);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');

        const applicationId = res.body.id;

        // Now upload a document
        const docRes = await request(app)
            .post('/api/documents/verify')
            .field('application_id', applicationId)
            .field('type', 'selfie')
            .attach('document', dummyFilePath);

        expect(docRes.statusCode).toEqual(200);
        expect(docRes.body).toHaveProperty('success', true);
    });
});
