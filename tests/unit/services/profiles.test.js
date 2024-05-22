const profilesService = require('../../../src/services/profiles');

const donationsModel = require('../../../src/models/donations');
const profilesModel = require('../../../src/models/profiles');

const { NotFoundError } = require('../../../src/utils/errors');

jest.mock('../../../src/models/donations');
jest.mock('../../../src/models/profiles');

describe('Profiles Service', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('"fetchProfiles"', () => {
        test('should fetch all profiles calling profilesModel.getProfiles', () => {
            // When
            profilesService.fetchProfiles();

            // Then
            expect(profilesModel.getProfiles).toHaveBeenCalledTimes(1);
        });
    });

    describe('"fetchDonationsByProfileId"', () => {
        test('should throw NotFoundError if profile does not exist', () => {
            // Given
            const profileId = '78afca18-8162-4ed5-9a7b-212b98c9ec87';
            profilesModel.getProfileById.mockReturnValue(undefined);

            // Then
            expect(() => profilesService.fetchDonationsByProfileId(profileId)).toThrow(NotFoundError);
            expect(profilesModel.getProfileById).toHaveBeenCalledWith(profileId);
        });

        test('should retrieve all donations of profileId', () => {
            // Given
            const selectedProfileId = '78afca18-8162-4ed5-9a7b-212b98c9ec87';
            const mockedProfile = {
                id: selectedProfileId,
                name: 'Campaign Profile',
                amount: 12620,
                parentId: null,
                currency: 'EUR'
            };
            const mockedRetrievedDonations = [
                {
                    id: '8a57b66e-a086-4621-9fea-991ed275f64b',
                    profileId: selectedProfileId,
                    donorName: 'John Smith',
                    amount: 9000,
                    currency: 'USD'
                },
                {
                    id: 'bdb6510f-42d9-461e-a93e-6bfac7dd4420',
                    profileId: selectedProfileId,
                    donorName: 'Janet Smith',
                    amount: 2000,
                    currency: 'EUR'
                }
            ];
            profilesModel.getProfileById.mockReturnValue(mockedProfile);
            donationsModel.getDonationsByProfileId.mockReturnValue(mockedRetrievedDonations);

            // When
            profilesService.fetchDonationsByProfileId(selectedProfileId);

            // Then
            expect(donationsModel.getDonationsByProfileId).toHaveBeenCalledWith(selectedProfileId);
        });
    });
});