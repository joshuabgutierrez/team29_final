const express = require("express");
const { getAllRecipes, createRecipe, updateRecipe, deleteRecipe } = require("../controllers/recipeController");
const { protect, authorize } = require("../../middleware/authMiddleware");
const { authorizeRecipe } = require("../../middleware/recipeMiddleware");

const router = express.Router();

router.get("/all", protect, getAllRecipes);
router.post("/create", createRecipe);
router.put("/update/:recipeId", protect, authorizeRecipe, updateRecipe);
router.delete("/delete/:recipeId", protect, authorizeRecipe, deleteRecipe);

module.exports = router;