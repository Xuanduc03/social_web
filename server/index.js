const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const router = require("./router/route");
const { initSocket } = require("./socket/socket"); // 🟢 Import đúng

require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔥 Gọi initSocket để khởi tạo socket.io
connectDB().then(() => {
  initSocket(server); // 🟢 Đúng cách
  server.listen(process.env.PORT || 8080, () => console.log("🚀 Server chạy trên port", process.env.PORT || 8080));
}).catch(err => {
  console.error("Failed to connect to database", err);
});
