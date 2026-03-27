const Category = require("../../../models/Category");
const Property = require("../../../models/Property");


exports.createProperty = async (req, res) => {
  try {

    const {
      name,
      description,
      category,
      price,
      address,
      city,
      location,
      attributes,
      images
    } = req.body;

    // 🔍 Validate category
    const categoryData = await Category.findById(category);

    if (!categoryData) {
      return res.status(400).json({
        message: "Invalid category"
      });
    }

    const property = await Property.create({
      name,
      description,
      category,
      price,
      address,
      city,
      location,
      attributes,
      images,
      businessOwner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

exports.getAllProperties = async (req, res) => {
  try {

    let { page = 1, limit = 10, search = "", city, category } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    let query = {};

    // 🔍 Global search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ];
    }

    // 🌆 City
    if (city) {
      query.city = { $regex: `^${city}$`, $options: "i" };
    }

    // 📂 Category (slug or name)
    if (category) {
      const categoryData = await Category.findOne({
        slug: { $regex: `^${category}$`, $options: "i" }
      });

      if (categoryData) {
        query.category = categoryData._id;
      } else {
        // no category found → return empty
        return res.json({
          success: true,
          total: 0,
          data: []
        });
      }
    }

    const total = await Property.countDocuments(query);

    const data = await Property.find(query)
      .populate("category")
      .populate("businessOwner", "name phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {

    const { id } = req.params;

    const property = await Property.findById(id)
      .populate("category")
      .populate("businessOwner", "name phone");

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    res.json({
      success: true,
      data: property
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {

    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    // 🔐 Only owner can update
    if (property.businessOwner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    const updated = await Property.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Property updated",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {

    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found"
      });
    }

    // 🔐 Only owner
    if (property.businessOwner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Property deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};