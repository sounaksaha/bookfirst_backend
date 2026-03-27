const router = require("express").Router();
const controller = require("../../controllers/auth/userAuthController");

router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);

module.exports = router;