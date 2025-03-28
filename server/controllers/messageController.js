const Message = require("../models/message");


module.exports.getMessages = async (senderId, receiverId) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: receiverId },
            ],
        })
            .sort("timestamp")
            .populate("sender", "username")
            .populate("receiver", "username");

        return messages;
    } catch (err) {
        throw new Error("Failed to fetch messages: " + err.message);
    }
}

// Lưu tin nhắn vào database
module.exports.saveMessage = async ({ sender, receiver, content }) => {
    try {
        const message = new Message({
            sender,
            receiver,
            content,
        });
        await message.save();

        // Populate thông tin người gửi và người nhận để trả về
        await message.populate("sender", "username");
        await message.populate("receiver", "username");

        return message;
    } catch (err) {
        throw new Error("Failed to save message: " + err.message);
    }
}
