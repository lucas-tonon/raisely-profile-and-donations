const { profiles: profilesData } = require('../../../src/database/db');
const { getProfiles, getProfileById, updateTotalForProfiles, updateTotalForCampaignProfile } = require('../../../src/models/profiles');

jest.mock('../../../src/database/db', () => {
    return {
        profiles: []
    };
});

describe('Profiles Model', () => {
    beforeEach(() => {
        profilesData.splice(0, profilesData.length);
    });

    describe('getProfiles', () => {
        test('should return "profilesData" as is', () => {
            // Given
            const profiles = [
                {
                    id: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
                    name: 'Campaign Profile',
                    total: 5000,
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: '2ad19172-9683-407d-9732-8397d58ddcb2',
                    name: 'Nick\'s Fundraising Profile',
                    total: 500,
                    parentId: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
                    currency: 'AUD'
                },
                {
                    id: '384f7229-a8b0-4d63-bab3-101d66047e24',
                    name: 'Campaign - More tests',
                    total: 0,
                    parentId: null,
                    currency: 'USD'
                },
            ];
            profilesData.push(...profiles);

            // When
            const retrievedProfiles = getProfiles();

            // Then
            expect(retrievedProfiles).toEqual(profiles);
        });
    });

    describe('getProfileById', () => {
        test('should return profile specified by given id', () => {
            // Given
            const selectedProfileId = '78afca18-8162-4ed5-9a7b-212b98c9ec87';
            const profiles = [
                {
                    id: selectedProfileId,
                    name: 'Campaign Profile',
                    total: 5000,
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: '2ad19172-9683-407d-9732-8397d58ddcb2',
                    name: 'Nick\'s Fundraising Profile',
                    total: 5000,
                    parentId: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
                    currency: 'AUD'
                },
                {
                    id: '384f7229-a8b0-4d63-bab3-101d66047e24',
                    name: 'Campaign - More tests',
                    total: 3000,
                    parentId: null,
                    currency: 'USD'
                },
            ];
            profilesData.push(...profiles);

            // When
            const retrievedProfile = getProfileById(selectedProfileId);

            // Then
            expect(retrievedProfile).toEqual(profiles[0]);
        });

        test('should return null when profileId does not exist', () => {
            // Given
            const selectedProfileId = '78afca18-8162-4ed5-9a7b-212b98c9ec87';

            // When
            const retrievedProfile = getProfileById(selectedProfileId);

            // Then
            expect(retrievedProfile).toEqual(null);
        });
    });

    describe('updateTotalForProfiles', () => {
        test('should return 0 if updatedProfiles param has no existing profiles', () => {
            // Given
            const updateProfiles = [
                {
                    id: 'f249c0c1-048c-4c12-9789-f0ad8d4c243b',
                    total: 5000
                },
                {
                    id: '42d2233f-29f4-4ab7-82d7-41dfcccf873c',
                    total: 9500
                }
            ];

            // When
            const updatedRecords = updateTotalForProfiles(updateProfiles);

            // Then
            expect(updatedRecords).toEqual(0);
        });

        test('should return number of updated records and update their totals when they exist', () => {
            // Given
            const updateProfiles = [
                {
                    id: 'f249c0c1-048c-4c12-9789-f0ad8d4c243b', // Campaign Profile
                    total: 5000
                },
                {
                    id: '42d2233f-29f4-4ab7-82d7-41dfcccf873c', // Non-existing profile
                    total: 9500
                }
            ];
            const profiles = [
                {
                    id: 'f249c0c1-048c-4c12-9789-f0ad8d4c243b',
                    name: 'Campaign Profile',
                    total: 1000,
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: '5ec5028f-ad53-45dc-8d5b-e6fad3d4d900',
                    name: 'Campaign Profile - Not updating',
                    total: 4000,
                    parentId: null,
                    currency: 'USD'
                },
            ];
            profilesData.push(...profiles);

            // When
            const updatedRecords = updateTotalForProfiles(updateProfiles);

            // Then
            expect(updatedRecords).toEqual(1);
            expect(profilesData[0].total).toEqual(5000);
        });
    });

    describe('updateTotalForCampaignProfile', () => {
        test('should return 0 if the profile does not exist', () => {
            // Given
            const donationAmount = 1000;
            const selectedProfileId = '2ad19172-9683-407d-9732-8397d58ddcb2';

            // When
            const updatedRecords = updateTotalForCampaignProfile(selectedProfileId, donationAmount);

            // Then
            expect(updatedRecords).toEqual(0);
        });

        test('should return 0 if the profile is not a campaign profile', () => {
            // Given
            const donationAmount = 1000;
            const selectedProfileId = '2ad19172-9683-407d-9732-8397d58ddcb2';
            const profiles = [
                {
                    id: '2ad19172-9683-407d-9732-8397d58ddcb2',
                    name: 'Nick\'s Fundraising Profile',
                    total: 5000,
                    parentId: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
                    currency: 'AUD'
                },
            ];
            profilesData.push(...profiles);

            // When
            const updatedRecords = updateTotalForCampaignProfile(selectedProfileId, donationAmount);

            // Then
            expect(updatedRecords).toEqual(0);
        });

        test('should return 1 if found campaign profile with given profile id and updated it', () => {
            // Given
            const newTotal = 1000;
            const originalAmount = 5000;
            const selectedProfileId = '78afca18-8162-4ed5-9a7b-212b98c9ec87';
            const profiles = [
                {
                    id: selectedProfileId,
                    name: 'Campaign Profile',
                    total: originalAmount,
                    parentId: null,
                    currency: 'AUD'
                },
            ];
            profilesData.push(...profiles);

            // When
            const updatedRecords = updateTotalForCampaignProfile(selectedProfileId, newTotal);

            // Then
            expect(updatedRecords).toEqual(1);
            expect(profilesData[0].total).toEqual(newTotal);
        });
    });
});