const { Server } = require("socket.io");

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

        socket.on("likePost", ({ postId, userId }) => {
            console.log(`📌 Like Post: ${postId} từ User ${userId}`);
            io.emit(`UpdateLikes:${postId}`, { postId, userId });
        });

        socket.on("commentPost", ({postId, userId}) => {
            console.log(`📌 comment Post: ${postId} từ User ${userId}`);
            io.emit(`UpdateLikes:${postId}`, { postId, userId });
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
