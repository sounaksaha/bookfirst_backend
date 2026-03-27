const router = require("express").Router();

const controller = require("../../controllers/admin/categoryController");

const auth = require("../../middlewares/authMiddleware");
const role = require("../../middlewares/roleMiddleware");


// 🔐 Protected (admin only)
router.post("/", auth, role("admin"), controller.createCategory);
router.put("/:id", auth, role("admin"), controller.updateCategory);
router.delete("/:id", auth, role("admin"), controller.deleteCategory);

// 🌐 Public / optional
router.get("/", controller.getAllCategories);
router.get("/:id", controller.getCategoryById);

module.exports = router;