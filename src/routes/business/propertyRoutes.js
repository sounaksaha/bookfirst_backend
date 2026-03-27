const router = require("express").Router();

const { createProperty, updateProperty, deleteProperty, getAllProperties, getPropertyById } = require("../../controllers/business/Property/propertyController");

const auth = require("../../middlewares/authMiddleware");
const role = require("../../middlewares/roleMiddleware");

// 🔐 Business owner only
router.post("/", auth, role("business_owner"), createProperty);
router.put("/:id", auth, role("business_owner"), updateProperty);
router.delete("/:id", auth, role("business_owner"), deleteProperty);

// 🌐 Public
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

module.exports = router;