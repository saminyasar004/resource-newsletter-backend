// dependencies
const url = require("url");
const newsletterService = require("../service/newsletter");
const {
    validateEmail,
    responseSender,
    sendVerificationMail,
} = require("../util/script");

// module scaffolding
const newsletterController = {};

/**
 * Subscribe the newsletter for a new email address
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
newsletterController.subscribeEmail = async (req, res) => {
    const errors = [];
    const email =
        typeof req.body.email === "string"
            ? validateEmail(req.body.email) === true
                ? req.body.email
                : errors.push("Email is invalid.")
            : errors.push("Email is invalid.");

    if (errors.length > 0) {
        responseSender(res, 400, {
            message: errors,
        });
    } else {
        /**
         * TODO:*
         * check that the email is not in the newsletter db
         * if verified --> response(400)
         * if not verified send a verification mail
         * insert the email into database
         * then send a confirmation mail to that email address
         */
        try {
            const existingEmail = await newsletterService.findByEmail(email);
            if (existingEmail.length > 0) {
                if (existingEmail[0].verified === "true") {
                    // verified email
                    responseSender(res, 400, {
                        message:
                            "You have already subscribed to our newsletter.",
                    });
                } else {
                    // email exist in the db but not verified
                    const verificationUrl = url.parse(
                        `${req.protocol}://${req.get("host")}${
                            req.originalUrl
                        }/verify/${existingEmail[0].id}/${
                            existingEmail[0].email
                        }/${existingEmail[0].subscribedAt}`
                    ).href;
                    sendVerificationMail(email, verificationUrl);
                    responseSender(res, 200, {
                        message:
                            "We've sent a verification mail in your email please verify your email.",
                    });
                }
            } else {
                // insert the email in to the newsletter db
                await newsletterService.subscribeEmail(email);
                const subscribedEmail = await newsletterService.findByEmail(
                    email
                );
                const verificationUrl = url.parse(
                    `${req.protocol}://${req.get("host")}${
                        req.originalUrl
                    }/verify/${subscribedEmail[0].id}/${
                        subscribedEmail[0].email
                    }/${subscribedEmail[0].subscribedAt}`
                ).href;
                sendVerificationMail(email, verificationUrl);
                responseSender(res, 201, {
                    message:
                        "You have successfully subscripted our newsletter. We've sent a verification mail in your email please verify your email.",
                });
            }
        } catch (err) {
            console.log(err.message);
            responseSender(res, 500, {
                message: "Error occures in the server side.",
            });
        }
    }
};

/**
 * Verify an email for subscription
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
newsletterController.verifyEmail = async (req, res) => {
    const {
        id: subscribedId,
        email: subscribedEmail,
        subscribedAt,
    } = req.params;
    if (!subscribedId || !subscribedEmail || !subscribedAt) {
        responseSender(res, 403, {
            message: "Forbidden",
        });
    } else {
        try {
            const lookupEmail =
                await newsletterService.lookupEmailForVerification({
                    id: subscribedId,
                    email: subscribedEmail,
                    subscribedAt,
                });
            if (lookupEmail.length === 0) {
                responseSender(res, 403, {
                    message: "Forbidden",
                });
            } else if (lookupEmail.length > 0) {
                if (lookupEmail[0].verified !== "false") {
                    responseSender(res, 403, {
                        message: "Forbidden",
                    });
                } else {
                    await newsletterService.verifyEmail(subscribedEmail);
                    responseSender(res, 201, {
                        message: "Successfully verified your email.",
                    });
                }
            }
        } catch (err) {
            console.log(err.message);
            responseSender(res, 500, {
                message: "Error occures in the servere side.",
            });
        }
    }
};

// exports module
module.exports = newsletterController;
