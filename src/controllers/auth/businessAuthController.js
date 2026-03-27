const otpService = require("../../services/auth/otpService");
const BusinessOwner = require("../../models/BusinessOwner");
const { saveTempUser,getTempUser, deleteTempUser } = require("../../utils/tempStore");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
  try {

    const {
      name,
      phone,
      email,
      address,
      aadharImage,
      panImage
    } = req.body;

    // 🔍 Check if already exists
    const exists = await BusinessOwner.findOne({
      $or: [{ phone }, { email }]
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // 🧠 Save temporarily
    saveTempUser(phone, {
      name,
      phone,
      email,
      address,
      aadharImage,
      panImage
    });

    // 📲 Send OTP
    await otpService.sendOtp(phone);

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {

    const { phone, otp } = req.body;

    const verification = await otpService.verifyOtp(phone, otp);

    if (verification.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // 🔍 Get temp data
    const tempData = getTempUser(phone);

    if (!tempData) {
      return res.status(400).json({
        success: false,
        message: "Session expired. Please try again"
      });
    }

    // ✅ Save to DB AFTER verification
    const owner = await BusinessOwner.create({
      ...tempData,
      isVerified: true
    });

    // 🧹 Remove temp data
    deleteTempUser(phone);

    // 🎟️ Token
    const token = jwt.sign(
      {
        id: owner._id,
        role: owner.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Registration successful",
      token,
      data: owner
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.loginSendOtp = async (req, res) => {
  try {

    const { phone } = req.body;

    // 🔍 Check user exists
    const owner = await BusinessOwner.findOne({ phone });

    if (!owner) {
      return res.status(200).json({
        success: true,
        register: false,
        message: "User not registered"
      });
    }

    // 🔐 Check admin approval
    if (!owner.isVerifiedByAdmin) {
      return res.status(403).json({
        success: false,
        message: "Waiting for admin approval"
      });
    }

    // 📲 Send OTP
    await otpService.sendOtp(phone);

    res.json({
      success: true,
      register: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.loginVerifyOtp = async (req, res) => {
  try {

    const { phone, otp } = req.body;

    const verification = await otpService.verifyOtp(phone, otp);

    if (verification.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // 🔍 Get user
    const owner = await BusinessOwner.findOne({ phone });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔐 Check admin approval again
    if (!owner.isVerifiedByAdmin) {
      return res.status(403).json({
        success: false,
        message: "Waiting for admin approval"
      });
    }

    // 🎟️ Generate token
    const token = jwt.sign(
      {
        id: owner._id,
        role: owner.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      data: owner
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};