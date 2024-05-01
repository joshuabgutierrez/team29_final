const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    const {username, email, bio} = req.body;

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
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.user.id !== userId) {
            return res.status(403).json({
                message: "User not authorized to delete this user"
            });
        }

        await user.deleteOne();
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error: ", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};