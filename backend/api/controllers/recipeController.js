const Recipe = require("../models/Recipe");
const User = require("../models/User");

exports.getAllRecipes = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        const usersToRetrieveRecipesFrom = [userId, ...user.following];
        
        const recipes = await Recipe.aggregate([
            {
                $match: {
                    createdBy: {
                        $in: usersToRetrieveRecipesFrom
                    }
                }
            },
            {
                $addFields: {
                    isLikedbyMe: {
                        $in: [userId, {$ifNull: ["$likes", []]}]
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "creatorInfo"
                }
            },
            {
                $unwind: "$creatorInfo"
            }, 
            {
                $project: {
                    title: 1,
                    ingredients: 1,
                    instructions: 1,
                    category: 1,
                    createdAt: 1,
                    image: 1,
                    likesCount: {
                        $size: {$ifNull: ["$likes", []]}
                    },
                    isLikedbyMe: 1,
                    "creatorInfo.username": 1
                }
            }
        ]);

        res.status(200).json({
            message: "Success",
            recipes
        });
    } catch (error) {
        console.error("Error fetching recipes: ", error.message);
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
            likes: req.body.likes,
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
    const {title, ingredients, instructions, category, likes, comments, image} = req.body;

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
    if (likes) {
        req.recipe.likes = likes;
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

exports.likeRecipe = async (req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.user._id;

    try {
        const recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        if (recipe.likes.length > 0) {
            if (recipe.likes.includes(userId)) {
                return res.status(400).json({
                    message: "You have already liked this recipe"
                })
            }
        }

        recipe.likes.push(userId);
        await recipe.save();

        res.status(200).json({
            message: "Recipe liked successfully",
            likesCount: recipe.likes.length
        })
    } catch (error) {
        console.error("Error liking the recipe: ", error.message);
        res.status(500).json({
            message: "Failed to like a recipe"
       });
    }
};

exports.unlikeRecipe = async (req, res) => {
    const recipeId = req.params.recipeId;
    const userId = req.user._id;

    try {
        const recipe = await Recipe.findByIdAndUpdate(
            recipeId,
            {
                $pull: {
                    likes: userId
                }
            },
            {
                new: true
            }
        );

        if (!recipe) {
            return res.status(404).json({
                message: "Recipe not found"
            });
        }

        res.status(200).json({
            message: "Recipe unliked successfully",
            totalLikes: recipe.likes
        })
    } catch (error) {
        console.error("Error unliking the recipe: ", error.message);
        res.status(500).json({
            message: "Failed to unlike a recipe"
       });
    }
};