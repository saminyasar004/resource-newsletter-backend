// dependencies
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const db = require("./src/db/db");
const app = require("./src/app/app");

// configuration
dotenv.config(path.join(__dirname, ".env"));
const PORT = process.env.PORT || 3000;

// module scaffolding
const server = http.createServer(app);

// database connection
db.init()
    .then(() => {
        db.databaseConnection.connect((dbConnectionErr) => {
            if (!dbConnectionErr) {
                console.log("Database connected successfully.");
                // server listening
                server.listen(PORT, (serverErr) => {
                    if (!serverErr) {
                        console.log(`Server is running on port: ${PORT}`);
                    } else {
                        console.log("Error occures while running the server.");
                        console.log(serverErr.message);
                    }
                });
            } else {
                console.log("Error occures while connecting the database.");
                console.log(dbConnectionErr.message);
            }
        });
    })
    .catch((dbInitErr) => {
        console.log(dbInitErr.message);
    });
