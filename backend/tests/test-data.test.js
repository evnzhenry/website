const request = require('supertest');
process.env.TEST_API_KEY = 'dev-test-key-123456'; // Ensure key is set for tests
const { app, initDatabase } = require('../server'); // Import the app and initDatabase
const baseUrl = app; // Supertest accepts the app object
const TEST_API_KEY = process.env.TEST_API_KEY;

beforeAll(async () => {
  await initDatabase();
});

describe('Test Data Endpoints', () => {
  it('rejects unauthorized submission', async () => {
    const res = await request(baseUrl).post('/api/test-data/submit').send({ type: 'sample', data: { a: 1 } });
    expect(res.status).toBe(401);
  });

  it('accepts valid submission and returns id', async () => {
    const res = await request(baseUrl)
      .post('/api/test-data/submit')
      .set('x-test-key', TEST_API_KEY)
      .send({ type: 'sample', data: { a: 1, b: 'x' }, status: 'received' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('type', 'sample');
  });

  it('retrieves records with pagination', async () => {
    const res = await request(baseUrl)
      .get('/api/test-data/records?limit=10&page=1')
      .set('x-test-key', TEST_API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('rows');
    expect(Array.isArray(res.body.rows)).toBe(true);
    expect(res.body).toHaveProperty('limit', 10);
    expect(res.body).toHaveProperty('page', 1);
  });

  it('supports XML format', async () => {
    const res = await request(baseUrl)
      .get('/api/test-data/records?format=xml&limit=1&page=1')
      .set('x-test-key', TEST_API_KEY);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/xml/);
    expect(res.text).toMatch(/<records>/);
  });

  it('exposes metrics', async () => {
    const res = await request(baseUrl)
      .get('/api/test-data/metrics')
      .set('x-test-key', TEST_API_KEY);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('submittedSuccess');
    expect(res.body).toHaveProperty('retrieveAvgMs');
  });
});