const express = require("express");
const { registerUser, getAllUsers, loginUser, updateUser, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/all", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:userId", protect, authorize, updateUser);
router.delete("/delete/:userId", protect, authorize, deleteUser);

module.exports = router;