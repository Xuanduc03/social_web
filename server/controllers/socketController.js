const MessageController = require("./messageController");

class SocketController {
    constructor(io) {
        this.io = io;
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            // Người dùng tham gia room của chính họ
            socket.on("joinChat", ({userId, friendId}) => {
                const room = [userId, friendId].sort().join("-"); // Tạo room từ userId và friendId
                socket.join(room);
                console.log(`User ${userId} joined room ${userId}`);
            });

            // Xử lý gửi tin nhắn
            socket.on("sendMessage", async (data) => {
                const { sender, receiver, content } = data;

                try {
                    // Lưu tin nhắn bằng MessageController
                    const message = await MessageController.saveMessage({
                        sender,
                        receiver,
                        content,
                    });

                    const room = [sender, receiver].sort().join("-"); // Tạo room từ sender và receiver 
                    // Gửi tin nhắn đến người nhận
                    this.io.to(room).emit("receiveMessage", {
                        sender: message.sender,
                        receiver: message.receiver,
                        content: message.content,
                        timestamp: message.timestamp,
                    });

                    console.log(`Message sent from ${sender} to ${receiver}: ${content}`);
                } catch (err) {
                    console.error("Error in sendMessage:", err.message);
                    socket.emit("error", { message: err.message });
                }
            });

            // Xử lý ngắt kết nối
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }
}

module.exports = SocketController;