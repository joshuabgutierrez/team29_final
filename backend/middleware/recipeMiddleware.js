const Recipe = require("../api/models/Recipe");

exports.authorizeRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        if (recipe.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized. You can only modify or delete your own recipes"
            })
        }

        req.recipe = recipe;
        next();

    } catch (error) {
        console.error("Authorization error: ", error.message);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};