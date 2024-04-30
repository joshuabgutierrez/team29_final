
exports.getAllRecipes = async (req, res) => {
    res.send("Getting all recipes");
};

exports.createRecipe = async (req, res) => {
    try {
        const recipeData = await req.body;

        console.log(recipeData);


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
};