import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styles from "./ChatBox.module.scss";
import classNames from "classnames/bind";
import { Avatar, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);
const socket = io(`${process.env.REACT_APP_SOCKET_URL}`, {
  withCredentials: true,
  transports: ["websocket"],
});

const ChatBox = ({ userId, friendId, friendName, friendAvatar, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Debug Socket connection
    socket.on("connect", () => console.log("🔥 Socket connected:", socket.id));
    socket.on("connect_error", (err) => console.error("❌ Socket connect error:", err));

    // Fetch tin nhắn cũ
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/messages?senderId=${userId}&receiverId=${friendId}`,
          { withCredentials: true }
        );
        console.log("📜 Fetched messages:", res.data);
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          console.warn("⚠️ No messages returned or invalid format:", res.data);
          setMessages([]);
        }
      } catch (err) {
        setMessages([]);
      }
    };
    fetchMessages();

    // Tham gia room chat
    socket.emit("joinChat", { userId, friendId });

    socket.on("roomJoined", ({ room, userId: joinedUserId, friendId: joinedFriendId }) => {
      toast(`✅ Joined room ${room}: ${joinedUserId} - ${joinedFriendId}`);
    });

    socket.on("receiveMessage", (message) => {
      toast("📩 Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("roomJoined");
      socket.off("receiveMessage");
      socket.off("error");
    };
  }, [userId, friendId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("sendMessage", {
        userId,
        friendId,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <div className={cx("chatBox")}>
      <div className={cx("chatHeader")}>
        <div className={cx("userInfo")}>
          <Avatar src={friendAvatar} className={cx("headerAvatar")} />
          <div>
            <h4>{friendName}</h4>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <div className={cx("headerActions")}>
          <IconButton className={cx("actionButton")}>
            <MoreVertIcon />
          </IconButton>
          <IconButton className={cx("actionButton")} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      <div className={cx("chatBody")}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={cx("messageWrapper", {
                sent: msg.sender._id === userId,
                received: msg.sender._id !== userId,
              })}
            >
              <div className={cx("message")}>
                <p>{msg.content}</p>
                <span className={cx("timestamp")}>
                  {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className={cx("noMessages")}>Chưa có tin nhắn nào</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={cx("chatFooter")}>
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton className={cx("sendButton")} onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatBox;