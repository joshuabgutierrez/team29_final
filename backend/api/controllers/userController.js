const User = require("../models/User");
const Recipe = require("../models/Recipe");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    try {
        // We check if the username is already taken
        let user = await User.findOne({email});

        if (user) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            message: "User was registered successfully"
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "A server error occurred"
        })
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to retrieve users"
        });
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id, email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            message: "Logged in successfully",
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            followers: user.followers,
            following: user.following,
            token
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Failed to login user"
        });
    }
};

exports.updateUser = async (req, res) => {
    const {userId} = req.params;
    const {username, email, bio, profilePicture} = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (username) {
            user.username = username;
        }
        if (email) {
            user.email = email;
        }
        if (bio) {
            user.bio = bio;
        }
        if(profilePicture) {
            user.profilePicture = profilePicture
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio
            }
        });
    } catch (error) {
        console.error("Update user error: ", error);
        res.status(500).json({message: "Error updating user"});
    }
};

exports.deleteUser = async (req, res) => {
    const {userId} = req.params;

    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findByIdAndDelete(userId).session(session);

        if (!user) {
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.user.id !== userId) {
            return res.status(403).json({
                message: "User not authorized to delete this user"
            });
        }

        await Recipe.deleteMany({
            createdBy: userId
        }).session(session);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Account deleted successfully"
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        console.error("Delete user error: ", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.followUser = async (req, res) => {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    try {
        if (userId.toString() === targetUserId.toString()) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        await User.findByIdAndUpdate(userId, {
            $addToSet: {
                following: targetUserId
            }
        });

        await User.findByIdAndUpdate(targetUserId, {
            $addToSet: {
                followers: userId
            }
        });
        
        res.status(200).json({
            message: "User followed successfully"
        });

    } catch (error) {
        console.error("Error following user: ", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.unfollowUser = async (req, res) => {
    const userId = req.user._id;
    const targetUserId = req.params.targetUserId;

    try {
        if (userId.toString() === targetUserId.toString()) {
            return res.status(400).json({
                message: "You cannot unfollow yourself"
            });
        }

        await User.findByIdAndUpdate(userId, {
            $pull: {
                following: targetUserId
            }
        });

        await User.findByIdAndUpdate(targetUserId, {
            $pull: {
                followers: userId
            }
        });
        
        res.status(200).json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        console.error("Error unfollowing user: ", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};