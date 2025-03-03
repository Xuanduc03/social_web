const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports.Register = async (req, res) => {
    try {
        const { firstName, lastName, gender, birthday, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                error: true,
                success: false
            });
        }

        // Validate all required fields
        if (!email || !password || !firstName || !lastName || !gender || !birthday) {
            return res.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            gender,
            birthday,
            email,
            password: hashPassword
        });

        const savedUser = await newUser.save();
        
        return res.status(201).json({
            data: {
                id: savedUser._id,
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName
            },
            message: "Đăng ký thành công",
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: error.message || "Đã xảy ra lỗi khi đăng ký",
            error: true,
            success: false
        });
    }
};

module.exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
                error: true,
                success: false
            });
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                error: true,
                success: false
            });
        }

        const tokenData = {
            _id: userData._id,
            email: userData.email
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { 
            expiresIn: "8h"
        });

        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        return res.cookie("token", token, tokenOption).json({
            message: "Login Successful",
            success: true,
            error: false,
            data: {
                token,
                user: {
                    id: userData._id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName
                }
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message || "An error occurred during login",
            success: false,
            error: true
        });
    }
};

module.exports.Logout = async (req, res) => {
    try {
        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        res.clearCookie("token", tokenOption);
        return res.status(200).json({
            message: "Logout Successful",
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Logout failed",
            success: false,
            error: true
        });
    }
};

module.exports.SetAvatar = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
                success: false,
                error: true
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image file",
                success: false,
                error: true
            });
        }

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                message: "Invalid image format. Only JPG, PNG, WEBP allowed",
                success: false,
                error: true
            });
        }

        const avatarUrl = `/uploads/${req.file.filename}`; // Changed to relative path
        const user = await User.findByIdAndUpdate(
            userId,
            {
                avatarImage: avatarUrl,
                isAvatarImageSet: true
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            data: { avatar: user.avatarImage },
            message: "Avatar uploaded successfully",
            success: true,
            error: false
        });
    } catch (error) {
        console.error("SetAvatar error:", error);
        return res.status(500).json({
            message: error.message || "Error uploading avatar",
            success: false,
            error: true
        });
    }
};

module.exports.GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } })
            .select("email firstName lastName avatarImage _id")
            .lean();

        return res.status(200).json({
            data: users,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("GetAllUsers error:", error);
        return res.status(500).json({
            message: error.message || "Error fetching users",
            success: false,
            error: true
        });
    }
};

module.exports.GetUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details retrieved successfully"
        });
    } catch (error) {
        console.error("GetUser error:", error);
        return res.status(500).json({
            message: error.message || "Error fetching user",
            success: false,
            error: true
        });
    }
};