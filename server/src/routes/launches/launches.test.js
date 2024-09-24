const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const res = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});

describe('Test POST /launches', () => {
  const reqBody = {
    mission: 'USS Enterprise',
    rocket: 'NCC 1701-d',
    target: 'Kepler 186 f',
  };
  const launchDate = 'January 4, 2028';
  test('It should respond with 201 success', async () => {
    const res = await request(app)
      .post('/launches')
      .send({ ...reqBody, launchDate })
      .expect('Content-Type', /json/)
      .expect(201);

    const reqDate = new Date(launchDate).valueOf();
    const resDate = new Date(res.body.launchDate).valueOf();
    expect(resDate).toBe(reqDate);
    expect(res.body).toMatchObject(reqBody);
  });

  test('It should catch missing required properties', async () => {
    const res = await request(app)
      .post('/launches')
      .send(reqBody)
      .expect('Content-Type', /json/)
      .expect(400);
    expect(res.body).toStrictEqual({
      error: 'Missing required launch property',
    });
  });

  test('It should catch invalid dates', async () => {
    const res = await request(app)
      .post('/launches')
      .send({ ...reqBody, launchDate: 'ABCD' })
      .expect('Content-Type', /json/)
      .expect(400);
    expect(res.body).toStrictEqual({
      error: 'Invalid launch date',
    });
  });
});
