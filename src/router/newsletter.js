// dependencies
const { Router } = require("express");
const newsletterController = require("../controller/newsletter");

// module scaffolding
const newsletterRouter = Router();

newsletterRouter.post("/", newsletterController.subscribeEmail);

newsletterRouter.get(
    "/verify/:id/:email/:subscribedAt",
    newsletterController.verifyEmail
);

// export module
module.exports = newsletterRouter;
