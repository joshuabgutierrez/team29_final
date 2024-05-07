const express = require("express");
const { registerUser, getAllUsers, loginUser, updateUser, deleteUser, followUser, unfollowUser, getUserById } = require("../controllers/userController");
const { protect, authorize } = require("../../middleware/authMiddleware");

const router = express.Router();

router.get("/:userId", protect, getUserById);
router.get("/all", getAllUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update/:userId", protect, authorize, updateUser);
router.delete("/delete/:userId", protect, authorize, deleteUser);
router.post("/follow/:targetUserId", protect, followUser);
router.post("/unfollow/:targetUserId", protect, unfollowUser);

module.exports = router;