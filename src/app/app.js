// dependencies
const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const notFoundMiddleware = require("../middleware/notFound");
const errorController = require("../controller/error");
const authorRouter = require("../router/author");
const newsletterRouter = require("../router/newsletter");

// module scaffolding
const app = express();

// configuration
dotenv.config(path.join(__dirname, "../../.env"));
app.use(express.json());
app.use(cors());

// router
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello world.",
    });
});

// author router
app.use("/api/v1/author", authorRouter);

// subscriber router
app.use("/api/v1/newsletter", newsletterRouter);

// not found middleware
app.use(notFoundMiddleware);

// default error handler
app.use(errorController);

// export module
module.exports = app;
