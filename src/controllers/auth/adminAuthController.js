const Admin = require("../../models/Admin");
const otpService = require("../../services/auth/otpService");
const { saveTempUser, getTempUser, deleteTempUser } = require("../../utils/tempStore");
const jwt = require("jsonwebtoken");


// ===============================
// 🔐 REGISTER
// ===============================

// SEND OTP
exports.registerSendOtp = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const exists = await Admin.findOne({ phone });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists"
      });
    }

    saveTempUser(phone, { name, phone, role: "admin" });

    await otpService.sendOtp(phone);

    res.json({
      success: true,
      message: "OTP sent for admin registration"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// VERIFY OTP + CREATE ADMIN
exports.registerVerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const verification = await otpService.verifyOtp(phone, otp);

    if (verification.status !== "approved") {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    const tempData = getTempUser(phone);

    if (!tempData) {
      return res.status(400).json({
        message: "Session expired"
      });
    }

    const admin = await Admin.create(tempData);

    deleteTempUser(phone);

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Admin registered successfully",
      token,
      data: admin
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// 🔐 LOGIN
// ===============================

// SEND OTP
exports.loginSendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const admin = await Admin.findOne({ phone });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    await otpService.sendOtp(phone);

    res.json({
      success: true,
      message: "OTP sent for login"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// VERIFY OTP
exports.loginVerifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const verification = await otpService.verifyOtp(phone, otp);

    if (verification.status !== "approved") {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    const admin = await Admin.findOne({ phone });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: admin
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};