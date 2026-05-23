const router = require("express").Router();

const controller = require("../../controllers/auth/businessAuthController");

// 🔐 REGISTER FLOW
router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);
router.post("/register",controller.registerBusinessOwner)


module.exports = router;