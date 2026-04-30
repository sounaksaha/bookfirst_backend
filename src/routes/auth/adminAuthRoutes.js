const router = require("express").Router();
const controller = require("../../controllers/auth/adminAuthController");

// REGISTER
router.post("/register", controller.register);

// LOGIN
router.post("/login", controller.login);

module.exports = router;