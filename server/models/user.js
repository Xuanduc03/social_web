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
        required: true,
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
        required: true,
        enum: ["male", "female", "other"],
    },
    job : {
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
        enum: ["single", "married", "divorced"],
        default: "single",
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
    avatarImage: {
        type: String,
        default: "",
    },
    coverPhoto: {
        type: String,
        default: "",
    },
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
