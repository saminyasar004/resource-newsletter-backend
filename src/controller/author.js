// dependencies
const path = require("path");
const authorService = require("../service/author");
const newsletterService = require("../service/newsletter");
const { responseSender, validateEmail } = require("../util/script");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config(path.join(__dirname, "../../.env"));

// module scaffolding
const authorController = {};

/**
 * Get all essential information for author dashboard
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
authorController.getAuthor = async (_req, res) => {
    try {
        const author = await authorService.findAll();
        delete author[0].password;
        const verifiedEmails = [
            ...(await newsletterService.getVerifiedEmails()),
        ].reduce((acc, el) => {
            acc.push(el.email);
            return acc;
        }, []);
        const unverifiedEmails = [
            ...(await newsletterService.getUnverifiedEmails()),
        ].reduce((acc, el) => {
            acc.push(el.email);
            return acc;
        }, []);
        author[0].verifiedEmails = verifiedEmails;
        author[0].unverifiedEmails = unverifiedEmails;
        responseSender(res, 200, {
            message: author[0],
        });
    } catch (err) {
        console.log(err.message);
        responseSender(res, 500, {
            message: "Error occures in the server side.",
        });
    }
};

/**
 * Register author for the application
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
authorController.registerAuthor = async (req, res) => {
    const errors = [];
    const name =
        typeof req.body.name === "string"
            ? req.body.name.length >= 3
                ? req.body.name
                : errors.push("Name is too short.")
            : errors.push("Name is invalid.");

    const email =
        typeof req.body.email === "string"
            ? validateEmail(req.body.email) === true
                ? req.body.email
                : errors.push("Email is invalid.")
            : errors.push("Email is invalid.");

    const password =
        typeof req.body.password === "string"
            ? req.body.password
            : errors.push("Password is not acceptable.");

    const resources =
        typeof req.body.resources === "object" &&
        req.body.resources instanceof Array
            ? JSON.stringify(req.body.resources)
            : errors.push("Resources should be an array.");

    const dayToSend =
        typeof req.body.dayToSend === "string"
            ? ["sat", "sun", "mon", "tue", "wed", "thu", "fri"].includes(
                  req.body.dayToSend
              ) === true
                ? req.body.dayToSend
                : errors.push("Day to send is invalid.")
            : errors.push("Day to send is invalid.");

    if (errors.length > 0) {
        responseSender(res, 400, { message: errors });
    } else {
        // check that there is no author in the database
        try {
            const hasAuthor =
                (await authorService.findAll()).length === 0 ? false : true;

            if (hasAuthor) {
                responseSender(res, 403, {
                    message: "There is an author already exist please login.",
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const payload = {
                    name,
                    email,
                    resources,
                    dayToSend,
                };
                const authToken = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: "2h",
                });

                const authorObj = {
                    name,
                    email,
                    password: hashedPassword,
                    resources,
                    dayToSend,
                    authToken,
                };

                await authorService.createAuthor(authorObj);
                responseSender(res, 201, {
                    message: "Author created successfully.",
                    authToken,
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
 * Login as a author
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
authorController.loginAuthor = async (req, res) => {
    const errors = [];
    const email =
        typeof req.body.email === "string"
            ? validateEmail(req.body.email) === true
                ? req.body.email
                : errors.push("Email is invalid.")
            : errors.push("Email is invalid.");

    const password =
        typeof req.body.password === "string"
            ? req.body.password
            : errors.push("Password is not acceptable.");

    if (errors.length > 0) {
        responseSender(res, 400, { message: errors });
    } else {
        try {
            const author = await authorService.findByProperty("email", email);
            if (author.length > 0) {
                const isValid = await bcrypt.compare(
                    password,
                    author[0].password
                );
                if (isValid) {
                    const payload = {
                        name: author[0].name,
                        email: author[0].email,
                        resources: author[0].resources,
                        dayToSend: author[0].dayToSend,
                    };
                    const authToken = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {
                            expiresIn: "2h",
                        }
                    );
                    // save the token in the database
                    await authorService.updateAuthTokenById(
                        author[0].id,
                        authToken
                    );
                    responseSender(res, 200, {
                        message: "Login successfull.",
                        authToken,
                    });
                } else {
                    responseSender(res, 400, {
                        message: "Invalid credentials.",
                    });
                }
            } else {
                responseSender(res, 400, {
                    message: "Invalid credentials.",
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
 * Edit acceptable author information
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
authorController.patchAuthor = async (req, res) => {
    /**
     * name
     * password
     * resources
     * dayToSend
     */
    const errors = [];
    let name,
        password,
        resources,
        dayToSend = null;
    if (req.body.name) {
        name =
            typeof req.body.name === "string"
                ? req.body.name.length >= 3
                    ? req.body.name
                    : errors.push("Name is too short.")
                : errors.push("Name is invalid.");
    }

    if (req.body.password) {
        password =
            typeof req.body.password === "string"
                ? req.body.password
                : errors.push("Password is not acceptable.");
    }

    if (req.body.resources) {
        resources =
            typeof req.body.resources === "object" &&
            req.body.resources instanceof Array
                ? JSON.stringify(req.body.resources)
                : errors.push("Resources should be an array.");
    }

    if (req.body.dayToSend) {
        dayToSend =
            typeof req.body.dayToSend === "string"
                ? ["sat", "sun", "mon", "tue", "wed", "thu", "fri"].includes(
                      req.body.dayToSend
                  ) === true
                    ? req.body.dayToSend
                    : errors.push("Day to send is invalid.")
                : errors.push("Day to send is invalid.");
    }

    if (errors.length > 0) {
        responseSender(res, 400, {
            message: errors,
        });
    } else {
        if (name || password || resources || dayToSend) {
            console.log(req.params.author);
            let authorObj = {
                name: req.params.author.name,
                password: req.params.author.password,
                resources: req.params.author.resources,
                dayToSend: req.params.author.dayToSend,
            };
            if (name) {
                authorObj.name = name;
            }
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                authorObj.password = hashedPassword;
            }
            if (resources) {
                authorObj.resources = resources;
            }
            if (dayToSend) {
                authorObj.dayToSend = dayToSend;
            }

            try {
                await authorService.updateAuthorById(
                    req.params.author.id,
                    authorObj
                );
                responseSender(res, 201, {
                    message: "Successfully updated.",
                });
            } catch (err) {
                console.log(err.message);
                responseSender(res, 500, {
                    message: "Error occures in the server side.",
                });
            }
        } else {
            responseSender(res, 400, {
                message:
                    "Please provide name or password or resources or dayToSend to update.",
            });
        }
    }
};

/**
 * Delete an author
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
authorController.deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.author.id;
        await authorService.deleteAuthorById(authorId);
        responseSender(res, 200, {
            message: "Successfully deleted the author.",
        });
    } catch (err) {
        console.log(err.message);
        responseSender(res, 500, {
            message: "Error occures in the server side.",
        });
    }
};

// export module
module.exports = authorController;
