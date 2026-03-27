const router = require("express").Router();

const controller = require("../../controllers/auth/businessAuthController");

// 🔐 REGISTER FLOW
router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);

// 🔐 LOGIN FLOW
router.post("/login/send-otp", controller.loginSendOtp);
router.post("/login/verify-otp", controller.loginVerifyOtp);

module.exports = router;