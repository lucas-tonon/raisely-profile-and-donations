const errorHandler = require('../../../src/middlewares/errorHandler');
const { AppError } = require('../../../src/utils/errors');

describe('ErrorHandler Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {},
            body: {}
        };

        res = {};
        res.json = jest.fn();
        res.status = jest.fn(() => res);

        next = jest.fn();
    });

    test('should return correct status and message if error is instanceof AppError', () => {
        // Given
        const err = new AppError('test exception', 418);

        // When
        errorHandler(err, req, res, next);

        // Then
        expect(res.status).toHaveBeenCalledWith(418);
        expect(res.status().json).toHaveBeenCalledWith({ message: 'test exception' });
    });

    test('should return 500 and default message if error is not instanceof AppError', () => {
        // Given
        const err = new Error('Unexpected error');

        // When
        errorHandler(err, req, res, next);

        // Then
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status().json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
});