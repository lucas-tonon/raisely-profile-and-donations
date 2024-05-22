const donationsService = require('../../../src/services/donations');

const donationsModel = require('../../../src/models/donations');
const profilesModel = require('../../../src/models/profiles');

const { buildProfileAndParentsTotalUpdateCache, profileAndParentsTotalUpdateCache } = require('../../../src/utils/cache');
const { NotFoundError, BadRequestError } = require('../../../src/utils/errors');
const { convertAmountToTargetCurrency } = require('../../../src/utils/convertRates');

jest.mock('../../../src/models/donations');
jest.mock('../../../src/models/profiles');
jest.mock('../../../src/utils/cache', () => {
    return {
        profileAndParentsTotalUpdateCache: {},
        buildProfileAndParentsTotalUpdateCache: jest.fn()
    };
});
jest.mock('../../../src/utils/convertRates');

describe('Donations Service', () => {
    beforeEach(() => {
        jest.resetAllMocks();

        const cacheKeys = Object.keys(profileAndParentsTotalUpdateCache);
        for (let cacheKey of cacheKeys) {
            delete profileAndParentsTotalUpdateCache[cacheKey];
        }
    });

    describe('"createDonationForProfileId', () => {
        test('should throw NotFoundError when profile does not exist', () => {
            // Given
            const profileId = '7bbde55e-baa9-42a0-8584-859843ca8189';
            const donation = {
                donorName: 'Jane Smith',
                amount: 1000,
                currency: 'USD'
            };

            // Then
            expect(() => donationsService.createDonationForProfileId(donation, profileId)).toThrow(NotFoundError);
        });

        test('should create donation converting currency and also create cache if not exists', () => {
            // Given
            const profileId = '7bbde55e-baa9-42a0-8584-859843ca8189';
            const donation = {
                donorName: 'Jane Smith',
                amount: 1000,
                currency: 'AUD'
            };
            const mockedProfile = {
                id: '7bbde55e-baa9-42a0-8584-859843ca8189',
                parentId: null,
                total: 0,
                currency: 'USD',
                name: 'Campaign Profile'
            };
            profilesModel.getProfileById.mockReturnValue(mockedProfile);
            profilesModel.getProfiles.mockReturnValue([mockedProfile]);
            buildProfileAndParentsTotalUpdateCache.mockReturnValue([{ id: mockedProfile.id, total: mockedProfile.total, currency: mockedProfile.currency }]);

            // When
            donationsService.createDonationForProfileId(donation, profileId);

            // Then
            expect(donationsModel.createDonation).toHaveBeenCalledWith({ ...donation, profileId });
            expect(convertAmountToTargetCurrency).toHaveBeenCalledWith(donation.amount, donation.currency, mockedProfile.currency);
            expect(buildProfileAndParentsTotalUpdateCache).toHaveBeenCalledTimes(1);
        });

        test('should create donation by reusing cache when it exists for profileId', () => {
            // Given
            const profileId = '7bbde55e-baa9-42a0-8584-859843ca8189';
            const donation = {
                donorName: 'Jane Smith',
                amount: 1000,
                currency: 'AUD'
            };
            const mockedProfile = {
                id: '7bbde55e-baa9-42a0-8584-859843ca8189',
                parentId: null,
                total: 0,
                currency: 'USD',
                name: 'Campaign Profile'
            };
            profilesModel.getProfileById.mockReturnValue(mockedProfile);
            profileAndParentsTotalUpdateCache[profileId] = [{ id: mockedProfile.id, total: mockedProfile.total, currency: mockedProfile.currency }];

            // When
            donationsService.createDonationForProfileId(donation, profileId);

            // Then
            expect(buildProfileAndParentsTotalUpdateCache).toHaveBeenCalledTimes(0);
        });
    });

    describe('"createDonationForCampaign', () => {
        test('should throw NotFoundError when profile does not exist', () => {
            // Given
            const donation = {
                donorName: 'Jane Smith',
                amount: 1000,
                currency: 'USD',
                profileId: '7bbde55e-baa9-42a0-8584-859843ca8189'
            };

            // Then
            expect(() => donationsService.createDonationForCampaign(donation)).toThrow(NotFoundError);
        });

        test('should throw BadRequestError when profile is not a campaign profile', () => {
            // Given
            const donation = {
                donorName: 'Jane Smith',
                amount: 1000,
                currency: 'USD',
                profileId: '7bbde55e-baa9-42a0-8584-859843ca8189'
            };
            const mockedProfile = {
                id: '7bbde55e-baa9-42a0-8584-859843ca8189',
                parentId: '7ca71064-1827-4b6b-b986-7aec78cbd4cd',
                total: 0,
                currency: 'USD',
                name: 'Common SubProfile'
            };
            profilesModel.getProfileById.mockReturnValue(mockedProfile);

            // Then
            expect(() => donationsService.createDonationForCampaign(donation)).toThrow(BadRequestError);
        });

        test('should create donation entity and update campaign profile total when profile exists and is a campaign profile', () => {
            // Given
            const donationAmountUSD = 1000;
            const donationAmountEUR = 1180;

            const donation = {
                donorName: 'Jane Smith',
                amount: donationAmountUSD,
                currency: 'USD',
                profileId: '7bbde55e-baa9-42a0-8584-859843ca8189'
            };
            const mockedProfile = {
                id: '7bbde55e-baa9-42a0-8584-859843ca8189',
                parentId: null,
                total: 0,
                currency: 'EUR',
                name: 'Campaign Profile'
            };
            profilesModel.getProfileById.mockReturnValue(mockedProfile);
            convertAmountToTargetCurrency.mockReturnValue(donationAmountEUR);

            // When
            donationsService.createDonationForCampaign(donation);

            // Then
            expect(donationsModel.createDonation).toHaveBeenCalledWith(donation);

            expect(convertAmountToTargetCurrency).toHaveBeenCalledWith(donation.amount, donation.currency, mockedProfile.currency);
            expect(profilesModel.updateTotalForCampaignProfile).toHaveBeenCalledWith(donation.profileId, donationAmountEUR);
        });
    });
});