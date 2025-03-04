const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authProtect = async (req, res, next) => {
    try {
        let token;

        // Check for token in cookies or authorization header
        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization?.startsWith("Bearer ")) {  // Added space after Bearer
            token = req.headers.authorization.split(" ")[1];
        }

        // If no token found
        if (!token) {
            return res.status(401).json({
                message: "Không có token xác thực!",
                success: false,
                error: true
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        // Find user by ID from decoded token
        const user = await User.findById(decoded._id || decoded.id).select("-password");
        
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng!",
                success: false,
                error: true
            });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        // Specific error handling for JWT errors
        let message = "Token không hợp lệ!";
        if (error.name === "TokenExpiredError") {
            message = "Token đã hết hạn!";
        } else if (error.name === "JsonWebTokenError") {
            message = "Token không hợp lệ!";
        }

        return res.status(401).json({
            message: message,
            success: false,
            error: true
        });
    }
};

module.exports = { authProtect };  // Export as object for consistency