const request = require('supertest');
const app = require('../../src/index');

const { profiles: profilesData, donations: donationsData } = require('../../src/database/db');

jest.mock('../../src/database/db', () => {
    return {
        profiles: [],
        donations: []
    };
});

describe('Donations API', () => {
    beforeEach(() => {
        profilesData.splice(0, profilesData.length);
        donationsData.splice(0, donationsData.length);
    });

    describe('POST "/donations"', () => {
        test('should respond with 400 when profileId property is not UUIDv4', async () => {
            // Given
            const requestBody = {
                profileId: '1234-something',
                currency: 'USD',
                donorName: 'Jane Austen',
                amount: 40000
            };

            // When
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"profileId" must be a valid GUID');
        });

        test('should respond with 400 when donorName is not a string', async () => {
            // Given
            const requestBody = {
                profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                currency: 'USD',
                donorName: 123,
                amount: 40000
            };

            // When
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"donorName" must be a string');
        });

        test('should respond with 400 when amount is not a number', async () => {
            // Given
            const requestBody = {
                profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                currency: 'USD',
                donorName: 'Jane Austen',
                amount: 'abc'
            };

            // When
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"amount" must be a number');
        });

        test('should respond with 400 when currency is not accepted', async () => {
            // Given
            const requestBody = {
                profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                currency: 'BRL',
                donorName: 'Jane Austen',
                amount: 40000
            };

            // When
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.error).toEqual('"currency" must be one of [USD, AUD, EUR]');
        });

        test('should respond with 400 when profile is not a campaign profile', async () => {
            // Given
            const requestBody = {
                donorName: 'Jane Smith',
                amount: 12000,
                currency: 'USD',
                profileId: 'ecec195f-6d7c-462a-8d3c-0b119a5fa496' // Test Sub-Profile
            };

            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    total: 0,
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: 'ecec195f-6d7c-462a-8d3c-0b119a5fa496',
                    name: 'Test Sub-Profile',
                    total: 0,
                    parentId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    currency: 'AUD'
                },
            ];
            profilesData.push(...mockedProfiles);

            // When
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(400);
            expect(response.body.message).toEqual('Profile is not a campaign profile');
        });

        test('should respond with 404 when profile does not exist', async () => {
            // Given
            const requestBody = {
                donorName: 'Jane Smith',
                amount: 12000,
                currency: 'USD',
                profileId: 'ecec195f-6d7c-462a-8d3c-0b119a5fa496'
            };

            // When
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(404);
            expect(response.body.message).toEqual('Profile not found');
        });

        test('should respond with 201 and the created donation when all is correct', async () => {
            // Given
            const currentTotalAmount = 10000;
            const donationAmount = 40000;
            const requestBody = {
                profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7', // Test Campaign Profile
                currency: 'USD',
                donorName: 'Jane Austen',
                amount: donationAmount
            };
            const mockedProfiles = [
                {
                    id: '4083ebb2-4923-4a78-93f4-e6f73dc753d7',
                    name: 'Test Campaign Profile',
                    total: currentTotalAmount,
                    parentId: null,
                    currency: 'USD'
                },
            ];
            profilesData.push(...mockedProfiles);

            // When
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ ...requestBody, id: expect.any(String), amount: donationAmount });
            expect(profilesData[0]).toEqual({ ...mockedProfiles[0], total: currentTotalAmount + donationAmount });
        });

        test('should respond with 201 and convert the amount of donation when currency for profile is different', async () => {
            // Given
            const donationAmountInUSD = 40000;
            const donationAmountInAUD = 29600; // 40000 * 0.74
            const requestBody = {
                profileId: '4083ebb2-4923-4a78-93f4-e6f73dc753d7', // Test Campaign Profile
                currency: 'USD',
                donorName: 'Jane Austen',
                amount: donationAmountInUSD
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
            const response = await request(app).post('/donations').send(requestBody);

            // Then
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ ...requestBody, id: expect.any(String), amount: donationAmountInUSD });
            expect(profilesData[0]).toEqual({ ...mockedProfiles[0], total: donationAmountInAUD });
        });
    });
});