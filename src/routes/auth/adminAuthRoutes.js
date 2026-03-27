const router = require("express").Router();
const controller = require("../../controllers/auth/adminAuthController");

// REGISTER
router.post("/register/send-otp", controller.registerSendOtp);
router.post("/register/verify-otp", controller.registerVerifyOtp);

// LOGIN
router.post("/login/send-otp", controller.loginSendOtp);
router.post("/login/verify-otp", controller.loginVerifyOtp);

module.exports = router;