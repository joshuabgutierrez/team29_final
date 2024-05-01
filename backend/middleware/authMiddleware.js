const jwt = require("jsonwebtoken");
const User = require("../api/models/User");


exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];            
        }

        if (!token) {
            return res.status(401).json({
                message: "Not authorized"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId);

        if (!req.user) {
            return res.status(404).json({
                message: "Account does not exist"
            })
        }

        next();
    } catch (error) {
        res.status(401).json({
            message: "Not authorized. Token failed"
        });
    }
};

exports.authorize = (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return res.status(403).json({
            message: "User not authorized to update this profile"
        });
    }
    next();
}