const Message = require("../models/message");
const Conversation = require("../models/conservation");

module.exports.getMessages = async (senderId, receiverId) => {
    try {
      // Tìm conversation dựa trên participants
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId], $size: 2 },
      }).populate({
        path: "messages",
        populate: [
          { path: "sender", select: "username avatarImage" },
          { path: "receiver", select: "username avatarImage" },
        ],
      });
  
      if (!conversation || !conversation.messages) {
        console.log("📜 No conversation or messages found for sender:", senderId, "receiver:", receiverId);
        return [];
      }
  
      console.log("📜 Messages fetched:", conversation.messages.length, "for sender:", senderId, "receiver:", receiverId);
      return conversation.messages; // Trả về mảng tin nhắn đã populate
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err.message);
      throw new Error("Failed to fetch messages: " + err.message);
    }
  };

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
