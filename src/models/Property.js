const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
{
  businessOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusinessOwner",
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  price: Number,

  rating: {
    type: Number,
    default: 0
  },

  address: String,
  city: String,

  // 🌍 GEO LOCATION
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  // 🔥 Dynamic fields (for gym, hotel, banquet etc.)
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },

  images: [String],

  isActive: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

// 🌍 Geo Index
propertySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Property", propertySchema);