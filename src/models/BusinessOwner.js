const mongoose = require("mongoose");

const businessOwnerSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    unique: true
  },

  address: String,

  // 🪪 KYC DOCUMENTS
  aadharImage: {
    type: String, // store image URL (S3 / Cloudinary)
    required: true
  },

  panImage: {
    type: String, // store image URL
    required: true
  },

  // ✅ ADMIN VERIFICATION
  isVerifiedByAdmin: {
    type: Boolean,
    default: false
  },

  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  role: {
    type: String,
    default: "business_owner"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("BusinessOwner", businessOwnerSchema);