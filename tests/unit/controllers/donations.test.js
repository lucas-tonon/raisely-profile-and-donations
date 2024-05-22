const donationsController = require('../../../src/controllers/donations');

const donationsService = require('../../../src/services/donations');

jest.mock('../../../src/services/donations');

describe('Donations Controller', () => {
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

    describe('createCampaignDonation', () => {
        test('should call donationsService.createDonationForCampaign', async () => {
            // Given
            req.body = {
                profileId: 'b6b3754b-6add-4f93-92ad-3af66f8b2896',
                donorName: 'Jane Smith',
                amount: 12000,
                currency: 'USD',
            };

            // When
            await donationsController.createCampaignDonation(req, res, next);

            // Then
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(donationsService.createDonationForCampaign).toHaveBeenCalledWith(req.body);
        });
    });
});