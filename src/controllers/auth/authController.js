const otpService = require("../../services/auth/otpService");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {

  const { phone } = req.body;

  await otpService.sendOtp(phone);

  res.json({
    success: true,
    message: "OTP sent"
  });

};

exports.verifyOtp = async (req, res) => {

  const { phone, otp } = req.body;

  const result = await otpService.verifyOtp(phone, otp);

  if (result.status !== "approved") {
    return res.status(400).json({
      message: "Invalid OTP"
    });
  }

  const token = jwt.sign(
    { phone },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token
  });

};