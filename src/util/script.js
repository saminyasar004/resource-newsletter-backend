// dependencies
const mailSender = require("./mailSender");

// module scaffolding
const util = {};

/**
 * Send response to the client
 *
 * @param {import("express").Response} res
 * @param {Number} status
 * @param {Object} payload
 */
util.responseSender = (res, status, payload) => {
    const statusCode = typeof status === "number" ? status : 500;
    const payloadObj =
        typeof payload === "object"
            ? { status: statusCode, ...payload }
            : {
                  status: statusCode,
                  message: "Error occures in the server side.",
              };

    res.setHeader("Content-Type", "application/json");
    res.status(statusCode).json(payloadObj);
};

/**
 * Creates a well formatted error
 *
 * @param {Number} status
 * @param {any} message
 * @returns {Error}
 */
util.createError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

/**
 * Validate an email address
 *
 * @param {String} email
 * @returns {Boolean}
 */
util.validateEmail = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gi.test(email);
};

// localhost:2004/api/v1/newsletter/verify/:id/:email/:subscribedAt
util.sendVerificationMail = async (email, verificationUrl) => {
    const subject = "Resource Newsletter Email Verification.";
    const html = `<h3>Please verify your email address by clicking the button below.</h3>
        <a href='${verificationUrl}' target='blank'>Verify</a>`;

    return await mailSender.sendMail({ to: email, subject, html });
};

// export module
module.exports = util;
