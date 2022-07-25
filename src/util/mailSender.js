// dependencies
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config(path.join(__dirname, "../../.env"));

// module scaffolding
const mailSender = {
    service: "gmail",
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
};

const mailTransporter = nodemailer.createTransport({
    service: mailSender.service,
    auth: {
        user: mailSender.user,
        pass: mailSender.pass,
    },
});

/**
 * Send mail using nodemailer
 *
 * @param {{to:String, subject:String, text:String, html:String}} mailOption
 * @returns {Promise}
 */
mailSender.sendMail = (mailOption) => {
    return new Promise((res, rej) => {
        console.log(mailSender);
        mailTransporter.sendMail(
            { ...mailOption, from: mailSender.user },
            (sendMailErr, sendMailResult) => {
                if (!sendMailErr) {
                    console.log("Mail sent successfully.");
                    res(sendMailResult);
                } else {
                    console.log("Error occures while sending mail.");
                    rej(new Error(sendMailErr.message));
                }
            }
        );
    });
};

// export module
module.exports = mailSender;
