const request = require('supertest');
const app = require('../../src/index');

describe('Profiles API', () => {
    test('GET "/profiles" should fetch all profiles', async () => {
        // When
        const response = await request(app).get('/profiles');

        // Then
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});