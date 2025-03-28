const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    lastMessage: { type: String },
    lastMessageTime: { type: Date },
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;