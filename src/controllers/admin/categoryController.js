const Category = require("../../models/Category");


// ✅ CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, fields, icon } = req.body;

    const exists = await Category.findOne({ name });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: name.toLowerCase(),
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      fields,
      icon
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ✅ GET ALL
exports.getAllCategories = async (req, res) => {
  try {

    // 🔍 Query params
    let { page = 1, limit = 10, search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // 🔍 Search condition
    const query = {
      name: { $regex: search, $options: "i" } // case-insensitive
    };

    // 📊 Total count
    const total = await Category.countDocuments(query);

    // 📦 Data with pagination
    const data = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ✅ GET BY ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      message: "Category not found"
    });
  }

  res.json({
    success: true,
    data: category
  });
};


// ✅ UPDATE
exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );

  res.json({
    success: true,
    message: "Updated successfully",
    data: category
  });
};


// ✅ DELETE
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  await Category.findByIdAndDelete(id);

  res.json({
    success: true,
    message: "Deleted successfully"
  });
};