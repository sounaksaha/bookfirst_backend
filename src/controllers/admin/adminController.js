const Category = require("../../models/Category");
const BusinessOwner = require("../../models/BusinessOwner");


// ===============================
// 📂 CATEGORY
// ===============================

exports.createCategory = async (req, res) => {
  try {
    const { name, fields } = req.body;

    const category = await Category.create({
      name: name.toLowerCase(),
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      fields
    });

    res.json({
      success: true,
      data: category
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  const data = await Category.find();

  res.json({
    success: true,
    data
  });
};


// ===============================
// 👨‍💼 BUSINESS OWNER APPROVAL
// ===============================

exports.getPendingBusinessOwners = async (req, res) => {
  const users = await BusinessOwner.find({
    verificationStatus: "pending"
  });

  res.json({
    success: true,
    data: users
  });
};

exports.approveBusinessOwner = async (req, res) => {
  const { id } = req.params;

  const user = await BusinessOwner.findByIdAndUpdate(
    id,
    {
      isVerifiedByAdmin: true,
      verificationStatus: "approved"
    },
    { new: true }
  );

  res.json({ success: true, data: user });
};