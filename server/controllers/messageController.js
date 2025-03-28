const Message = require("../models/message");


module.exports.getMessages = async (senderId, receiverId) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        })
            .sort("timestamp")
            .populate("sender", "username avatarImage")
            .populate("receiver", "username avatarImage");

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

        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [sender, receiver],
                messages: [message._id],
                lastMessage: content,
                lastMessageTime: message.timestamp,
            });
        } else {
            conversation.messages.push(message._id);
            conversation.lastMessage = content;
            conversation.lastMessageTime = message.timestamp;
        }
        await conversation.save();
        
        return message;
    } catch (err) {
        throw new Error("Failed to save message: " + err.message);
    }
}
