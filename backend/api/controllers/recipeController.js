const Recipe = require("../models/Recipe");

exports.getAllRecipes = async (req, res) => {
    try {
        console.log(req.user);
        const recipes = await Recipe.find({
            createdBy: req.user._id
        });

        res.status(200).json({
            message: "success",
            recipes
        })
    } catch (error) {
        console.error("Error fetching recipes");
        res.status(500).json({
            message: "Failed to get recipes"
        });      
    }
};

exports.createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe({
            title: req.body.title,
            ingredients: req.body.ingredients,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            category: req.body.category,
            createdBy: req.body.createdBy,
            ratings: req.body.ratings,
            comments: req.body.comments,
            image: req.body.image,
        });

        await newRecipe.save();

        res.status(201).json({
            message: "Recipe added successfully",
            recipe: newRecipe
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    };
};

exports.updateRecipe = async (req, res) => {
    const {title, ingredients, instructions, category, ratings, comments, image} = req.body;

    try {
        
    if (title) {
        req.recipe.title = title;
    }
    if (ingredients) {
        req.recipe.ingredients = ingredients;
    }
    if (instructions) {
        req.recipe.instructions = instructions;
    }
    if (category) {
        req.recipe.category = category;
    }
    if (ratings) {
        req.recipe.ratings = ratings;
    }
    if (comments) {
        req.recipe.comments = comments;
    }
    if (image) {
        req.recipe.image = image;
    }

    await req.recipe.save();
    res.status(200).json({
        message: "Recipe updated successfully"
    });
    } catch (error) {
        console.error("Failed to update recipe: ", error.message);
        res.status(500).json({
            message: "Failed to update recipe"
       });
    }
};

exports.deleteRecipe = async (req, res) => {
    try {
        await req.recipe.deleteOne();
        res.status(200).json({
            message: "Recipe deleted successfully"
        });
    } catch (error) {
        console.error("Failed to delete recipe: ", error.message);
        res.status(500).json({
            message: "Failed to delete recipe"
       });
    }

    
};