// dependencies
const db = require("../db/db");

// module scaffolding
const newsletterService = {};

/**
 * Subscribe an email for the newsletter
 *
 * @param {String} email
 * @returns {Promise}
 */
newsletterService.subscribeEmail = (email) => {
    return new Promise((res, rej) => {
        const createQuery = `INSERT INTO newsletter (email, verified, subscribedAt) VALUES ('${email}', 'false', '${Date.now()}')`;
        db.databaseConnection.query(createQuery, (createErr, createResult) => {
            if (!createErr) {
                res(createResult);
            } else {
                console.log("Error occures while subscribing for an email.");
                rej(new Error(createErr.message));
            }
        });
    });
};

/**
 * Lookup through the newsletter database by an email
 *
 * @param {String} email
 * @returns {Promise}
 */
newsletterService.findByEmail = (email) => {
    return new Promise((res, rej) => {
        const findQuery = `SELECT * FROM newsletter WHERE email = '${email}';`;
        db.databaseConnection.query(findQuery, (findErr, findResult) => {
            if (!findErr) {
                res(findResult);
            } else {
                console.log("Error occures while finding by email.");
                rej(new Error(findErr.message));
            }
        });
    });
};

/**
 * Find verified emails from the database
 *
 * @returns {Promise}
 */
newsletterService.getVerifiedEmails = () => {
    return new Promise((res, rej) => {
        const findQuery = `SELECT email FROM newsletter WHERE verified = 'true';`;
        db.databaseConnection.query(findQuery, (findErr, findResult) => {
            if (!findErr) {
                res(findResult);
            } else {
                console.log("Error occures while finding verified emails.");
                rej(new Error(findErr.message));
            }
        });
    });
};

/**
 * Verify an email
 *
 * @param {String} email
 * @returns {Promise}
 */
newsletterService.verifyEmail = (email) => {
    return new Promise((res, rej) => {
        const verifyQuery = `UPDATE newsletter SET verified = 'true' WHERE newsletter.email = '${email}';`;
        db.databaseConnection.query(verifyQuery, (verifyErr, verifyResult) => {
            if (!verifyErr) {
                res(verifyResult);
            } else {
                console.log("Error occures while verifying an email.");
                rej(new Error(verifyErr.message));
            }
        });
    });
};

/**
 * Lookup an email for verification
 *
 * @param {{id:Number, email:String, subscribedAt:String}} param0
 * @returns {Promise}
 */
newsletterService.lookupEmailForVerification = ({
    id,
    email,
    subscribedAt,
}) => {
    return new Promise((res, rej) => {
        const lookupQuery = `SELECT * FROM newsletter WHERE id = '${id}' AND email = '${email}' AND subscribedAt = '${subscribedAt}';`;
        db.databaseConnection.query(lookupQuery, (lookupErr, lookupResult) => {
            if (!lookupErr) {
                res(lookupResult);
            } else {
                console.log(
                    "Error occures while lookup email for verification."
                );
                rej(new Error(lookupErr.message));
            }
        });
    });
};

// export module
module.exports = newsletterService;
