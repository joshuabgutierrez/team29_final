const express = require("express");
const { getAllRecipes, createRecipe } = require("../controllers/recipeController");

const router = express.Router();

router.get("/all", getAllRecipes);
router.post("/create", createRecipe);

module.exports = router;