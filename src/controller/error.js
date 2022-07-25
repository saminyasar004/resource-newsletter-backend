// dependencies
const { responseSender } = require("../util/script");

/**
 * The defualt error controller for this app
 *
 * @param {import("express").ErrorRequestHandler} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const errorController = (err, req, res, next) => {
    if (err.status) {
        // our custom error
        responseSender(res, err.status, { message: err.message });
    } else {
        console.log(err.message);
        responseSender(res, 500, {
            message: "Error occures in the server side.",
        });
    }
};

// export module
module.exports = errorController;
