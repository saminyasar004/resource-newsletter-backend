// dependencies
const { Router } = require("express");
const authorController = require("../controller/author");
const authorizationMiddleware = require("../middleware/authorization");

// module scaffolding
const authorRouter = Router();

authorRouter.get("/", authorizationMiddleware, authorController.getAuthor);

authorRouter.post("/register", authorController.registerAuthor);

authorRouter.post("/login", authorController.loginAuthor);

authorRouter.patch("/", authorizationMiddleware, authorController.patchAuthor);

authorRouter.delete(
    "/",
    authorizationMiddleware,
    authorController.deleteAuthor
);

// export module
module.exports = authorRouter;
