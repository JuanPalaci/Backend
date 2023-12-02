const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const {registerValidator} = require("../validators/auth.validators");
const {runValidation}  = require("../middlewares/validator.middleware");


router.post("/register",
    registerValidator,
    runValidation,
    authController.register
)

router.post("/login",
authController.login);

router.get("/tagsUSER",
authController.tags);

module.exports = router;