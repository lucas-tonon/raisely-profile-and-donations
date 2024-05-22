const request = require('supertest');
const app = require('../../src/index');

const { profiles: profilesData, donations: donationsData } = require('../../src/database/db');
const { profileAndParentsTotalUpdateCache } = require('../../src/utils/cache');

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

        const cacheKeys = Object.keys(profileAndParentsTotalUpdateCache);
        for (let cacheKey of cacheKeys) {
            delete profileAndParentsTotalUpdateCache[cacheKey];
        }
    });

    describe('GET "/profiles"', () => {
        test('should respond with 200 and all profiles in DB', async () => {
            // Given
            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    total: 10000,
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: 'ac6f34ac-4bb9-40f2-a542-bb74fb8ad7df',
                    name: 'Test Profile for Fundraising',
                    total: 0,
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
        test('should respond with 200 and all donations for profileId', async () => {
            // Given
            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    total: 16800,
                    parentId: null,
                    currency: 'EUR'
                },
                {
                    id: 'ac6f34ac-4bb9-40f2-a542-bb74fb8ad7df',
                    name: 'Test Profile for Fundraising',
                    total: 0,
                    parentId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    currency: 'USD'
                },
                {
                    id: 'fdb241c1-f02f-4ce7-ace7-27f0102dd92f',
                    name: 'Another Campaign Profile',
                    total: 2500,
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
                    profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7', // Test Campaign Profile
                    currency: 'USD'
                },
                {
                    id: '93144a5b-c311-4ca6-adc0-6573fd006f79',
                    donorName: 'Nathan Drake',
                    amount: 2500,
                    profileId: 'fdb241c1-f02f-4ce7-ace7-27f0102dd92f', // Another Campaign Profile
                    currency: 'EUR'
                },
            ];
            donationsData.push(...mockedDonations);

            // When
            const response = await request(app).get('/profiles/4083ebb2-4923-4a78-93f4-e6f73dc753d7/donations'); // Test Campaign Profile

            // Then
            expect(response.status).toBe(200);
            expect(response.body.length).toEqual(2);
        });

        test('should respond with 400 when profile path param is not UUIDv4', async () => {
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
                    amount: 10000,
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
        test('should respond with 400 when profile path param is not UUIDv4', async () => {
            // When
            const response = await request(app).post('/profiles/1234-something/donations');

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"profile" must be a valid GUID');
        });

        test('should respond with 400 when currency body param is not accepted', async () => {
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

        test('should respond with 400 when donorName body param is not a string', async () => {
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

        test('should respond with 400 when amount body param is not a number', async () => {
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
                    total: 0,
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
            const donationAmount = 12000;
            const profileTotalAmount = 5000;
            const requestBody = {
                donorName: 'Jane Smith',
                amount: donationAmount,
                currency: 'AUD',
            };

            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    total: profileTotalAmount,
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
                ...requestBody
            }));
            expect(profilesData[0].total).toEqual(profileTotalAmount + donationAmount);
        });

        test('should respond with 201 and create donation with converted currency when different than profile currency', async () => {
            // Given
            const donationAmountInUSD = 10000;
            const donationAmountInAUD = 7400;
            const requestBody = {
                donorName: 'Jane Smith',
                amount: donationAmountInUSD,
                currency: 'USD',
            };

            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    total: 0,
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
                ...requestBody
            }));
            expect(profilesData[0].total).toEqual(donationAmountInAUD);
        });


        test('should respond with 201 update total for all parents of original profile', async () => {
            // Given
            const originalAmount = 5000;
            const donationAmount = 10000;
            const requestBody = {
                donorName: 'Jane Smith',
                amount: donationAmount,
                currency: 'AUD',
            };

            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    total: originalAmount,
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: '8e637778-e214-4665-8b43-9c6e67ec0fa7',
                    name: 'Fundraising Profile 1',
                    total: originalAmount,
                    parentId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7', // Test Campaign Profile
                    currency: 'AUD'
                },
                {
                    id: '7de48a5e-8481-42ca-8551-ad2645b16d9f',
                    name: 'Fundraising Profile 1.1',
                    total: originalAmount,
                    parentId: '8e637778-e214-4665-8b43-9c6e67ec0fa7', // Fundraising Profile 1
                    currency: 'AUD'
                },
            ];
            profilesData.push(...mockedProfiles);

            // When
            const response = await request(app).post('/profiles/7de48a5e-8481-42ca-8551-ad2645b16d9f/donations').send(requestBody); // Fundraising Profile 1.1

            // Then
            expect(response.status).toBe(201);
            expect(response.body).toEqual(expect.objectContaining({
                id: expect.any(String),
                profileId: '7de48a5e-8481-42ca-8551-ad2645b16d9f',
                ...requestBody
            }));

            for (let profile of profilesData) {
                expect(profile.total).toEqual(originalAmount + donationAmount);
            }
        });
    });
});