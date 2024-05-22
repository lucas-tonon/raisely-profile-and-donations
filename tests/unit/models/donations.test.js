const { donations: donationsData } = require('../../../src/database/db');
const { createDonation, getDonationsByProfileId } = require('../../../src/models/donations');

jest.mock('../../../src/database/db', () => {
    return {
        donations: []
    };
});

describe('Donations Model', () => {
    beforeEach(() => {
        donationsData.splice(0, donationsData.length);
    });

    describe('getDonationsByProfileId', () => {
        test('should return donations corresponding to specified profileId', () => {
            // Given
            const selectedProfileId = '1ee899a4-80e2-4e9d-8db6-5386bcdad922'; // Jane Smith
            const donations = [
                {
                    donorName: 'Jane Smith',
                    amount: 1000,
                    currency: 'USD',
                    profileId: selectedProfileId // Jane Smith
                },
                {
                    donorName: 'John Doe',
                    amount: 12000,
                    currency: 'EUR',
                    profileId: '14d0133e-30fb-486e-b0d1-1271f5d7804d'
                },
                {
                    donorName: 'Ana Maria Silva',
                    amount: 9500,
                    currency: 'AUD',
                    profileId: '0756e1c4-a319-4645-b8b8-70714fd713b3'
                }
            ];
            donationsData.push(...donations);

            // When
            const retrievedDonations = getDonationsByProfileId(selectedProfileId);

            // Then
            expect(retrievedDonations).toEqual([donations[0]]);
        });
    });

    describe('createDonation', () => {
        test('should create donation with a uuidv4 "id" field', () => {
            // Given
            const donation = {
                donorName: 'Jane Smith',
                amount: 1000,
                currency: 'USD',
                profileId: '1ee899a4-80e2-4e9d-8db6-5386bcdad922'
            };

            // When
            const createdDonation = createDonation(donation);

            // Then
            expect(createdDonation).toEqual({ ...donation, id: expect.any(String) });
        });
    });
});