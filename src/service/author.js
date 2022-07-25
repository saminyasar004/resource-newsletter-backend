// dependencies
const db = require("../db/db");

// module scaffolding
const authorService = {};

/**
 * Find all value from the database
 *
 * @returns {Promise}
 */
authorService.findAll = () => {
    return new Promise((res, rej) => {
        const findQuery = "SELECT * FROM author;";
        db.databaseConnection.query(findQuery, (findErr, findResult) => {
            if (!findErr && findResult) {
                res(findResult);
            } else {
                console.log("Error occures while finding all author.");
                rej(new Error(findErr.message));
            }
        });
    });
};

/**
 * Find a property value in the database
 *
 * @param {any} property - Property name of the table
 * @param {any} vlaue - Property value
 * @returns {Promise}
 */
authorService.findByProperty = (property, vlaue) => {
    return new Promise((res, rej) => {
        const findQuery = `SELECT * FROM author WHERE ${[
            property,
        ]} = '${vlaue}'`;
        db.databaseConnection.query(findQuery, (findErr, findResult) => {
            if (!findErr && findResult) {
                res(findResult);
            } else {
                console.log("Error occures while finding by property.");
                rej(new Error(findErr.message));
            }
        });
    });
};

/**
 * Create an author in the database
 *
 * @param {Object} authorObj
 * @returns {Promise}
 */
authorService.createAuthor = ({
    name,
    email,
    password,
    resources,
    dayToSend,
    authToken,
}) => {
    return new Promise((res, rej) => {
        const createQuery = `INSERT INTO author (name, email, password, resources, dayToSend, authToken) VALUES ('${name}', '${email}', '${password}', '${resources}', '${dayToSend}', '${authToken}');`;
        db.databaseConnection.query(createQuery, (createErr, createResult) => {
            if (!createErr) {
                res(createResult);
            } else {
                console.log("Error occures while creating an author.");
                rej(new Error(createErr.message));
            }
        });
    });
};

/**
 * Update a author's auth token by its id
 *
 * @param {Number} id
 * @param {String} authToken
 * @returns {Promise}
 */
authorService.updateAuthTokenById = (id, authToken) => {
    return new Promise((res, rej) => {
        const updateQuery = `UPDATE author SET authToken = '${authToken}' WHERE author.id = '${id}'`;
        db.databaseConnection.query(updateQuery, (updateErr, updateResult) => {
            if (!updateErr) {
                res(updateResult);
            } else {
                console.log("Error occures while updating the auth token.");
                rej(new Error(updateErr.message));
            }
        });
    });
};

/**
 * Update author information by id
 *
 * @param {Number} id
 * @param {Object} authorObj
 * @returns {Promise}
 */
authorService.updateAuthorById = (
    id,
    { name, password, resources, dayToSend }
) => {
    return new Promise((res, rej) => {
        const updateQuery = `UPDATE author SET name = '${name}', password = '${password}', resources = '${resources}', dayToSend = '${dayToSend}' WHERE author.id = '${id}'`;
        db.databaseConnection.query(updateQuery, (updateErr, updateResult) => {
            if (!updateErr) {
                res(updateResult);
            } else {
                console.log("Error occures while updating author by id.");
                rej(new Error(updateErr.message));
            }
        });
    });
};

/**
 * Delete author by it's id
 *
 * @param {Number} id
 * @returns {Promise}
 */
authorService.deleteAuthorById = (id) => {
    return new Promise((res, rej) => {
        const deleteQuery = `DELETE FROM author WHERE author.id = '${id}'`;
        db.databaseConnection.query(deleteQuery, (deleteErr, deleteResult) => {
            if (!deleteErr) {
                res(deleteResult);
            } else {
                console.log("Error occures while deleting an author.");
                rej(new Error(deleteErr.message));
            }
        });
    });
};

// export module
module.exports = authorService;
