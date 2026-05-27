const router = require("express").Router();

const controller = require("../../controllers/auth/businessAuthController");

// 🔐 REGISTER FLOW
router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);
router.post("/register",controller.registerBusinessOwner)
router.post("/login-otp", controller.loginOtp);
router.post("/verify-login-otp", controller.verifyLoginOtp);

module.exports = router;