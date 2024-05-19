const profilesService = require('../../src/services/profiles');
const profilesModel = require('../../src/models/profiles');

jest.mock('../../src/models/profiles');

describe('Profiles Service', () => {
    beforeEach(() => {
        profilesModel.getProfiles.mockClear();
    });

    describe('"fetchProfiles"', () => {
        test('should retrieve all profiles', () => {
            // Given
            const profiles = [
                {
                    id: 'b650a7ad-5ef7-40f9-b82a-753aa0f3ef64',
                    name: 'Test Profile',
                    parentId: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
                    currency: 'USD'
                }
            ];
            profilesModel.getProfiles.mockReturnValue(profiles);

            // When
            const result = profilesService.fetchProfiles();

            // Then
            expect(result).toEqual(profiles);
        });
    });
});