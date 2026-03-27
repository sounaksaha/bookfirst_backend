const otpService = require("../../services/auth/otpService");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  const user = await User.findOne({ phone });

  if (!user) {
    return res.json({
      success: true,
      register: false
    });
  }

  await otpService.sendOtp(phone);

  res.json({
    success: true,
    register: true,
    message: "OTP sent"
  });
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const verify = await otpService.verifyOtp(phone, otp);

  if (verify.status !== "approved") {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const user = await User.findOne({ phone });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
    data: user
  });
};