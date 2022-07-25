// dependencies
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv");

// module scaffolding
const db = {};

// configuration
dotenv.config(path.join(__dirname, "../../.env"));
db.DATABASE_URL = process.env.DATABASE_URL || null;

db.init = () => {
    return new Promise((res, rej) => {
        if (db.DATABASE_URL) {
            db.databaseConnection = mysql.createConnection(db.DATABASE_URL);
            const createAuthorTableQuery =
                "CREATE TABLE IF NOT EXISTS `author` (`id` INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, `name` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `resources` VARCHAR(255) NOT NULL, `dayToSend` VARCHAR(255) NOT NULL, `authToken` VARCHAR(765) NOT NULL);";
            db.databaseConnection.query(
                createAuthorTableQuery,
                (createAuthorErr) => {
                    if (!createAuthorErr) {
                        console.log("Author table created successfully.");
                        const createNewsletterQuery =
                            "CREATE TABLE IF NOT EXISTS `newsletter` (`id` INT(255) NOT NULL AUTO_INCREMENT PRIMARY KEY, `email` VARCHAR(255) NOT NULL, `verified` VARCHAR(255) NOT NULL, `subscribedAt` VARCHAR(255) NOT NULL);";
                        db.databaseConnection.query(
                            createNewsletterQuery,
                            (createNewsletterErr) => {
                                if (!createNewsletterErr) {
                                    console.log(
                                        "Newsletter table created successfully."
                                    );
                                    res();
                                } else {
                                    console.log(
                                        "Error occures while creating newsletter table."
                                    );
                                    rej(new Error(createNewsletterErr.message));
                                }
                            }
                        );
                    } else {
                        console.log(
                            "Error occures while creating author table."
                        );
                        rej(new Error(createAuthorErr.message));
                    }
                }
            );
        } else {
            rej(new Error("Database url couldn't found."));
        }
    });
};

// export module
module.exports = db;
