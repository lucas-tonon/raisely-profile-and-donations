const request = require('supertest');
const app = require('../../src/index');

const { profiles: profilesData, donations: donationsData } = require('../../src/database/db');

jest.mock('../../src/database/db', () => {
    return {
        profiles: [],
        donations: []
    };
});

describe('Profiles API', () => {
    beforeEach(() => {
        profilesData.splice(0, profilesData.length);
        donationsData.splice(0, donationsData.length);
    });

    describe('GET "/profiles"', () => {
        test('should respond with 200 and all profiles in DB', async () => {
            // Given
            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: 'ac6f34ac-4bb9-40f2-a542-bb74fb8ad7df',
                    name: 'Test Profile for Fundraising',
                    parentId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    currency: 'USD'
                }
            ];
            profilesData.push(...mockedProfiles);

            // When
            const response = await request(app).get('/profiles');

            // Then
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockedProfiles);
        });
    });

    describe('GET "/profiles/:profile/donations"', () => {
        test('should respond with 200 and all donations for profile and its sub-profiles', async () => {
            // Given
            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: 'ac6f34ac-4bb9-40f2-a542-bb74fb8ad7df',
                    name: 'Test Profile for Fundraising',
                    parentId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    currency: 'USD'
                },
                {
                    id: 'fdb241c1-f02f-4ce7-ace7-27f0102dd92f',
                    name: 'Another Campaign Profile',
                    parentId: null,
                    currency: 'EUR'
                }
            ];
            profilesData.push(...mockedProfiles);

            const mockedDonations = [
                {
                    id: '1e5d2a34-ffe0-484f-9d43-0d9f1c2cc03a',
                    donorName: 'Jane Smith',
                    amount: 5000,
                    profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7', // Test Campaign Profile
                    currency: 'EUR'
                },
                {
                    id: 'a0bde541-f11e-4e6d-824b-cd5a0f05616e',
                    donorName: 'John Smith',
                    amount: 10000,
                    profileId: 'ac6f34ac-4bb9-40f2-a542-bb74fb8ad7df', // Test Profile for Fundraising
                    currency: 'USD'
                },
                {
                    id: '93144a5b-c311-4ca6-adc0-6573fd006f79',
                    donorName: 'Nathan Drake',
                    amount: 2500,
                    profileId: 'fdb241c1-f02f-4ce7-ace7-27f0102dd92f', // Another Campaign Profile
                    currency: 'USD'
                },
            ];
            donationsData.push(...mockedDonations);

            // When
            const response = await request(app).get('/profiles/4083ebb2-4923-4a78-93f4-e6f73dc753d7/donations'); // Using Test Campaign Profile id

            // Then
            expect(response.status).toBe(200);
            expect(response.body.length).toEqual(2);
            for (let donation of response.body) {
                expect(donation.currency).toEqual('AUD');
            }
        });

        test('should respond with 400 when profile is invalid', async () => {
            // When
            const response = await request(app).get('/profiles/1234-something/donations');

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"profile" must be a valid GUID');
        });


        test('should respond with 404 when profile does not exist', async () => {
            // Given
            const mockedUnexistentProfileId = 'ecec195f-6d7c-462a-8d3c-0b119a5fa496';
            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    parentId: null,
                    currency: 'AUD'
                },
            ];
            profilesData.push(...mockedProfiles);

            // When
            const response = await request(app).get(`/profiles/${mockedUnexistentProfileId}/donations`);

            // Then
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('Profile not found');
        });
    });

    describe('POST "/profiles/:profile/donations"', () => {
        test('should respond with 400 when profile path param is invalid', async () => {
            // When
            const response = await request(app).post('/profiles/1234-something/donations');

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"profile" must be a valid GUID');
        });

        test('should respond with 400 when currency body param is invalid', async () => {
            // Given
            const requestBody = {
                donorName: 'Jane Smith',
                amount: 12000,
                currency: 'BRL',
            };

            // When
            const response = await request(app).post('/profiles/ecec195f-6d7c-462a-8d3c-0b119a5fa496/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"currency" must be one of [USD, AUD, EUR]');
        });

        test('should respond with 400 when donorName body param is invalid', async () => {
            // Given
            const requestBody = {
                donorName: 1234,
                amount: 12000,
                currency: 'USD',
            };

            // When
            const response = await request(app).post('/profiles/ecec195f-6d7c-462a-8d3c-0b119a5fa496/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"donorName" must be a string');
        });

        test('should respond with 400 when amount body param is invalid', async () => {
            // Given
            const requestBody = {
                donorName: 'Jane Smith',
                amount: 'amount',
                currency: 'USD',
            };

            // When
            const response = await request(app).post('/profiles/ecec195f-6d7c-462a-8d3c-0b119a5fa496/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"amount" must be a number');
        });

        test('should respond with 404 when profile does not exist', async () => {
            // Given
            const requestBody = {
                donorName: 'Jane Smith',
                amount: 12000,
                currency: 'USD',
            };

            const mockedUnexistentProfileId = 'ecec195f-6d7c-462a-8d3c-0b119a5fa496';
            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    parentId: null,
                    currency: 'AUD'
                },
            ];
            profilesData.push(...mockedProfiles);

            // When
            const response = await request(app).post(`/profiles/${mockedUnexistentProfileId}/donations`).send(requestBody);

            // Then
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('Profile not found');
        });

        test('should respond with 201 and return a new donation when profile exists', async () => {
            // Given
            const requestBody = {
                donorName: 'Jane Smith',
                amount: 12000,
                currency: 'USD',
            };

            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    parentId: null,
                    currency: 'AUD'
                },
            ];
            profilesData.push(...mockedProfiles);

            // When
            const response = await request(app).post('/profiles/4083ebb2-4923-4a78-93f4-e6f73dc753d7/donations').send(requestBody);

            // Then
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                id: expect.any(String),
                profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                donorName: 'Jane Smith',
                amount: 12000,
                currency: 'USD',
            }));
        });
    });
});