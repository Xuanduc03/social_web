const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    birthday: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["nam", "nữ", "khác"],
        default: "nam",
    },
    job: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    maritalStatus: {
        type: String,
        enum: ["độc thân", "đã kết hôn", "ly hôn", "mập mờ"],
        default: "độc thân",
    },
    bio: {
        type: String,
        default: "",
    },
    socialLinks: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: [
        {
            url: {
                type: String,
                trim: true,
            },
            public_id: {
                type: String,
                required: true,
                // match: /^https?:\/\/.+/i, // Kiểm tra định dạng URL
            },
        },
    ],
    coverPhoto: [
        {
            url: {
                type: String,
                trim: true,
            },
            public_id: {
                type: String,
                required: true,
                // match: /^https?:\/\/.+/i, // Kiểm tra định dạng URL
            },
        },
    ],
    createAt: {
        type: Date,
        default: Date.now,
    },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    },
    // Friends
    friendRequests: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
            requestedAt: { type: Date, default: Date.now },
        },
    ],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Notifications
    notifications: [
        {
            type: { type: String, enum: ["friend_request", "message", "like", "comment"], required: true },
            fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            content: { type: String },
            isRead: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
        },
    ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
