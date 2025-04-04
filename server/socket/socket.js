const { Server } = require("socket.io");
const messageController = require("../controllers/messageController");
let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true
        },
        transports: ["websocket", "polling"] // 🔥 Bắt buộc dùng WebSocket & Polling
    });

    io.on("connection", (socket) => {
        console.log("🔥 User connected", socket.id);

        socket.on("joinUser", (userId) => {
            socket.join(userId);
        });

        
        socket.on("likePost", ({ postId, userId }) => {
            console.log(`📌 Like Post: ${postId} từ User ${userId}`);
            io.emit(`UpdateLikes:${postId}`, { postId, userId });
        });

        socket.on("commentPost", ({ postId, userId }) => {
            console.log(`📌 comment Post: ${postId} từ User ${userId}`);
            io.emit(`UpdateLikes:${postId}`, { postId, userId });
        });

        // Người dùng tham gia room của chính họ
        socket.on("joinChat", ({ userId, friendId }) => {
            const room = [userId, friendId].sort().join("-"); // Tạo room từ userId và friendId
            socket.join(room);
            console.log(`User ${userId} joined room ${userId}`);
            io.to(room).emit("roomJoined", {room, userId, friendId})
        });

        // Xử lý gửi tin nhắn real-time
        socket.on("sendMessage", async ({ userId, friendId, content }) => {
            try {
              const message = await messageController.saveMessage({
                sender: userId, // Đổi tên param cho khớp
                receiver: friendId,
                content,
              });
      
              const room = [userId, friendId].sort().join("-");
              io.to(room).emit("receiveMessage", message);
              console.log(`📩 Message sent in room ${room}:`, message);
            } catch (error) {
              console.error("❌ Error sending message:", error.message);
              socket.emit("error", { message: error.message });
            }
          });


        socket.on("disconnect", () => {
            console.log("❌ User disconnected", socket.id);
        });
    });
};

const getIo = () => {
    if (!io) throw new Error("Socket chưa được khởi tạo");
    return io;
};

module.exports = { initSocket, getIo };
