const profilesController = require('../../../src/controllers/profiles');

const donationsService = require('../../../src/services/donations');
const profilesService = require('../../../src/services/profiles');

jest.mock('../../../src/services/donations');
jest.mock('../../../src/services/profiles');

describe('Profiles Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };
        res = {
            status: jest.fn(() => ({ json: jest.fn() })),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('"fetchAllProfiles"', () => {
        test('should call profilesService.fetchProfiles', async () => {
            // When
            await profilesController.fetchAllProfiles(req, res, next);

            // Then
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(profilesService.fetchProfiles).toHaveBeenCalledTimes(1);
        });
    });

    describe('"fetchDonationsByProfileId"', () => {
        test('should call profilesService.fetchDonationsByProfileId with correct profileId', async () => {
            // Given
            const profileId = '78afca18-8162-4ed5-9a7b-212b98c9ec87';
            req.params = {
                profile: profileId
            };

            // When
            await profilesController.fetchDonationsByProfileId(req, res, next);

            // Then
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(profilesService.fetchDonationsByProfileId).toHaveBeenCalledWith(profileId);
        });
    });

    describe('"createDonationForProfileId"', () => {
        test('should call profilesService.createDonationForProfileId with body data and correct profileId', async () => {
            // Given
            const profileId = '78afca18-8162-4ed5-9a7b-212b98c9ec87';
            const requestBody = {
                donorName: 'John Doe',
                amount: 9500,
                currency: 'USD'
            };

            req.body = { ...requestBody };
            req.params = {
                profile: profileId
            };

            // When
            await profilesController.createDonationForProfileId(req, res, next);

            // Then
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(donationsService.createDonationForProfileId).toHaveBeenCalledWith({ ...requestBody }, profileId);
        });
    });
});