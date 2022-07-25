// dependencies
const { createError } = require("../util/script");

/**
 * Handle 404 not found route
 *
 * @param {import("express").Request} _req
 * @param {import("express").Response} _res
 * @param {import("express").NextFunction} next
 */
const notFoundMiddleware = (_req, _res, next) => {
    next(createError(404, "Your requested content couldn't found."));
};

// export module
module.exports = notFoundMiddleware;
