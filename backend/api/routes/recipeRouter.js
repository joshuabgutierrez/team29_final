const express = require("express");
const { getAllRecipes, createRecipe, updateRecipe, deleteRecipe, likeRecipe, unlikeRecipe } = require("../controllers/recipeController");
const { protect, authorize } = require("../../middleware/authMiddleware");
const { authorizeRecipe } = require("../../middleware/recipeMiddleware");

const router = express.Router();

router.get("/all", protect, getAllRecipes);
router.post("/create", createRecipe);
router.put("/update/:recipeId", protect, authorizeRecipe, updateRecipe);
router.delete("/delete/:recipeId", protect, authorizeRecipe, deleteRecipe);
router.post("/:recipeId/like", protect, likeRecipe);
router.post("/:recipeId/unlike", protect, unlikeRecipe);

module.exports = router;