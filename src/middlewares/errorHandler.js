const { AppError } = require('../utils/errors');

/**
 * Middleware used as custom error handling for errors thrown inside controllers
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} _next
 * @returns
 */
const errorHandler = (err, req, res, _next) => {
    console.error(err.stack);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorHandler;