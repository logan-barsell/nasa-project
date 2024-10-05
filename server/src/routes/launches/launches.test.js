const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const res = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test POST /launches', () => {
    const reqBody = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-d',
      target: 'Kepler-62 f',
    };
    const launchDate = 'January 4, 2028';
    test('It should respond with 201 success', async () => {
      const res = await request(app)
        .post('/v1/launches')
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
        .post('/v1/launches')
        .send(reqBody)
        .expect('Content-Type', /json/)
        .expect(400);
      expect(res.body).toStrictEqual({
        error: 'Missing required launch property',
      });
    });

    test('It should catch invalid dates', async () => {
      const res = await request(app)
        .post('/v1/launches')
        .send({ ...reqBody, launchDate: 'ABCD' })
        .expect('Content-Type', /json/)
        .expect(400);
      expect(res.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
