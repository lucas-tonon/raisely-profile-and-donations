const profilesController = require('../../src/controllers/profiles');
const profilesService = require('../../src/services/profiles');

jest.mock('../../src/services/profiles');

describe('Profiles Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('"/profiles" endpoint', () => {
        it('should fetch all profiles', async () => {
            // Given
            const profiles = [
                {
                    id: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
                    name: 'Campaign Profile',
                    parentId: null,
                    currency: 'AUD'
                },
                {
                    id: 'b650a7ad-5ef7-40f9-b82a-753aa0f3ef64',
                    name: 'Test Profile',
                    parentId: '78afca18-8162-4ed5-9a7b-212b98c9ec87',
                    currency: 'USD'
                }
            ];

            profilesService.fetchProfiles.mockReturnValue(profiles);

            // When
            await profilesController.fetchAllProfiles(req, res, next);

            // Then
            expect(res.json).toHaveBeenCalledWith(profiles);
        });
    });
});