// dependencies
const path = require("path");
const authorService = require("../service/author");
const jwt = require("jsonwebtoken");
const { responseSender } = require("../util/script");
const dotenv = require("dotenv").config(path.join(__dirname, "../../.env"));

/**
 * Middleware to authorize the client
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const authorizationMiddleware = async (req, res, next) => {
    const authToken = req.headers.authorization
        ? req.headers.authorization.split(" ").length === 2
            ? req.headers.authorization.split(" ")[1]
            : null
        : null;
    if (authToken) {
        try {
            const payload = jwt.verify(authToken, process.env.SECRET_KEY);
            const author = await authorService.findByProperty(
                "email",
                payload.email
            );
            if (author[0].authToken === authToken) {
                //? authorized
                req.params.author = author[0];
                next();
            } else {
                // ! unauthorized
                responseSender(res, 401, {
                    message: "Unauthorized",
                });
            }
        } catch (err) {
            console.log(err.message);
            responseSender(res, 401, {
                message: "Unauthorized",
            });
        }
    } else {
        responseSender(res, 401, {
            message: "Unauthorized",
        });
    }
};

// export module
module.exports = authorizationMiddleware;
