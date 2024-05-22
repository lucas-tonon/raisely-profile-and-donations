/**
 * Validation for request path params
 * @param {*} schema Joi validation schema for given endpoint
 * @returns
 */
const validatePathParams = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.params);

        if (result.error) {
            return res.status(400).json({
                error: result.error.details[0].message
            });
        }

        next();
    };
};

/**
 * Validation for request body
 * @param {*} schema Joi validation schema for given endpoint
 * @returns
 */
const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.validate(req.body);

        if (result.error) {
            return res.status(400).json({
                error: result.error.details[0].message
            });
        }

        next();
    };
};

module.exports = {
    validateBody,
    validatePathParams
};