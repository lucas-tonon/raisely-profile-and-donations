/**
 * Middleware to allow catching errors thrown by controllers in APIs
 * @param {*} fn Reference to controller function that receives (req, res, next)
 * @returns
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;