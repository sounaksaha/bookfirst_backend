const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  slug: {
    type: String,
    unique: true
  },

  // optional: icon/image for frontend
  icon: {
    type: String
  },

  // 🔥 Dynamic fields (VERY IMPORTANT for future scalability)
  fields: [
    {
      type: String
    }
  ],

  isActive: {
    type: Boolean,
    default: true
  }

},
{
  timestamps: true
});

module.exports = mongoose.model("Category", categorySchema);