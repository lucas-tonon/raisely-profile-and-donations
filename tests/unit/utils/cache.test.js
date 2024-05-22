const { buildProfileAndParentsTotalUpdateCache } = require('../../../src/utils/cache');


describe('Cache Utility', () => {
    describe('"buildProfileAndParentsTotalUpdateCache"', () => {
        test('should generate profileAndParentsTotalUpdateCache from profiles array and profileId', () => {
            // Given
            /*
             * Tree example (adjacency list representation):
             * Campaign 1: [Fundraising 1.1, Fundraising 1.2]
             * Fundraising 1.1: [Fundraising 1.1.1]
             * Fundraising 1.1.1: []
             * Fundraising 1.2: []
             * Campaign 2: []
             */
            const profileIdCampaign1 = '473ad641-6df7-4783-99ab-8809cf6324ae';
            const profileIdFundraising11 = '9f36d898-fd71-49a7-bbb2-44d0fae8b403';
            const profileIdFundraising111 = '5dc5b6d0-151b-4491-9160-3fd3b7c7035e';
            const profileIdFundraising12 = '089ef1e5-8f84-4ddf-be54-a507e7562c55';
            const profileIdCampaign2 = '4feafa95-ff27-481b-b3e2-6b77dbf44eb3';
            const profiles = [
                {
                    id: profileIdCampaign1,
                    name: 'Campaign 1',
                    total: 5000,
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: profileIdFundraising11,
                    name: 'Fundraising 1.1',
                    total: 4000,
                    parentId: profileIdCampaign1,
                    currency: 'EUR'
                },
                {
                    id: profileIdFundraising111,
                    name: 'Fundraising 1.1.1',
                    total: 3000,
                    parentId: profileIdFundraising11,
                    currency: 'USD'
                },
                {
                    id: profileIdFundraising12,
                    name: 'Fundraising 1.2',
                    total: 0,
                    parentId: profileIdCampaign1,
                    currency: 'USD'
                },
                {
                    id: profileIdCampaign2,
                    name: 'Campaign 2',
                    total: 0,
                    parentId: null,
                    currency: 'USD'
                },
            ];

            // When
            const result = buildProfileAndParentsTotalUpdateCache(profiles, profileIdFundraising111);

            // Then
            expect(result).toEqual([
                {
                    id: profileIdFundraising111,
                    total: 3000,
                    currency: 'USD'
                },
                {
                    id: profileIdFundraising11,
                    total: 4000,
                    currency: 'EUR'
                },
                {
                    id: profileIdCampaign1,
                    total: 5000,
                    currency: 'AUD'
                },
            ]);
        });
    });
});