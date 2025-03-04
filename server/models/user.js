const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
    },
    birthday : {
        type: Date,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    isAvatarImageSet : {
        type : Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: "",
    },
    createAt: {
        type: Date,
        default: Date.now
    },

    //Friends
    friendRequests: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
          requestedAt: { type: Date, default: Date.now },
        },
      ],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    
});

const User = mongoose.model("User", userSchema);

module.exports = User;