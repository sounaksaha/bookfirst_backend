const BusinessOwner = require("../../models/BusinessOwner");


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