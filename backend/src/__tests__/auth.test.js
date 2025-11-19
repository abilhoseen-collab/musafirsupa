const request = require('supertest');
const app = require('../app');

describe('প্রমাণীকরণ API', () => {
  test('সঠিক শংসাপত্র দিয়ে লগইন করা উচিত', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  test('ভুল পাসওয়ার্ড দিয়ে লগইন ব্যর্থ হওয়া উচিত', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});