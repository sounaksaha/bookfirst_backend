const otpService = require("../../services/auth/otpService");
const BusinessOwner = require("../../models/BusinessOwner");
const jwt = require("jsonwebtoken");
const {
  saveVerifiedPhoneSession,
  deleteTempUser,
  getVerifiedPhoneSession,
} = require("../../utils/tempUserStore");

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const isValidPhone = /^\+[1-9]\d{7,14}$/.test(phone);

    if (!isValidPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must include country code. Example: +919876543210",
      });
    }

    const exists = await BusinessOwner.findOne({ phone });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You have already registered",
      });
    }

    await otpService.sendOtp(phone);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const isValidPhone = /^\+[1-9]\d{7,14}$/.test(phone);

    if (!isValidPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must include country code. Example: +919876543210",
      });
    }

    const verification = await otpService.verifyOtp(phone, otp);

    if (verification.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const exists = await BusinessOwner.findOne({ phone });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You have already registered",
      });
    }

    saveVerifiedPhoneSession(phone);

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully. Please complete registration within 1 hour.",
      data: {
        phone,
        expiresIn: "1 hour",
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.registerBusinessOwner = async (req, res) => {
  try {
    let { phone, name, email } = req.body;

    if (!phone || !name) {
      return res.status(400).json({
        success: false,
        message: "Phone and name are required",
      });
    }

    phone = phone.trim();
    name = name.trim();
    email = email ? email.trim().toLowerCase() : undefined;

    const isValidPhone = /^\+[1-9]\d{7,14}$/.test(phone);

    if (!isValidPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must include country code. Example: +919876543210",
      });
    }

    const verifiedSession = getVerifiedPhoneSession(phone);

    if (!verifiedSession) {
      return res.status(400).json({
        success: false,
        message:
          "OTP verification expired or not found. Please verify your phone number again.",
      });
    }

    const query = email ? { $or: [{ phone }, { email }] } : { phone };

    const exists = await BusinessOwner.findOne(query);

    if (exists) {
      let message = "This phone number is already registered";

      if (email && exists.email === email) {
        message = "This email is already registered";
      }

      return res.status(400).json({
        success: false,
        message,
      });
    }

    const businessOwner = await BusinessOwner.create({
      phone,
      name,
      ...(email && { email }),
      isPhoneVerified: true,
    });

    deleteTempUser(phone); // make sure this deletes the verified OTP session

    return res.status(201).json({
      success: true,
      message: "Registration completed successfully",
      data: businessOwner,
    });
  } catch (error) {
    console.error("Register Business Owner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.loginOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const isValidPhone = /^\+[1-9]\d{7,14}$/.test(phone);

    if (!isValidPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number must include country code. Example: +919876543210",
      });
    }

    const exists = await BusinessOwner.findOne({ phone });

    if (exists) {
      await otpService.sendOtp(phone);
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    }
    return res.status(400).json({
      success: false,
      message: "You have not registered.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    const isValidPhone = /^\+[1-9]\d{7,14}$/.test(phone);

    if (!isValidPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number must include country code. Example: +919876543210",
      });
    }

    const owner = await BusinessOwner.findOne({ phone });

    if (!owner) {
      return res.status(400).json({
        success: false,
        message: "You have not registered.",
      });
    }

    const verification = await otpService.verifyOtp(phone, otp);

    if (verification.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const token = jwt.sign(
      {
        id: owner._id,
        phone: owner.phone,
        role: owner.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: owner._id,
        name: owner.name,
        phone: owner.phone,
        email: owner.email,
        role: owner.role,
        isVerifiedByAdmin: owner.isVerifiedByAdmin,
        verificationStatus: owner.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Verify Login OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};