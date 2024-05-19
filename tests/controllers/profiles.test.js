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

    describe('GET "/profiles" endpoint', () => {
        test('should respond with 200 and fetch all profiles', async () => {
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

    describe('GET "/profiles/:profile/donations" endpoint', async () => {
        // TODO: should respond with 200 and retrieve all donations when all is correct

        // TODO: should respond with 200 and return empty array if no donations exist

        // TODO: should respond with 400 in case of invalid profileId

        // TODO: should respond with 404 if profile does not exist
    });

    describe('POST "/profiles/:profile/donations" endpoint', async () => {
        // TODO: should respond with 201 and create a donation when all is correct

        // TODO: should respond with 404 if profile does not exist

        // TODO: should respond with 400 in case of invalid donation fields (one test per field)
    });
});