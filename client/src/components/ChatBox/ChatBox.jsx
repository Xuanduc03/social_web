import React, { use, useEffect, useRef, useState } from "react";
import styles from "./ChatBox.module.scss";
import classNames from "classnames/bind";
import { Avatar, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { io } from "socket.io-client";

const cx = classNames.bind(styles);
const socket = io("http://localhost:8080", { withCredentials: true, transports: ["websocket"], });

const ChatBox = ({ userId, friendId, friendName, friendAvatar, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);


  useEffect(() => {
    // Lấy tin nhắn cũ
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/messages?senderId=${userId}&receiverId=${friendId}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    // Tham gia room chat
    socket.emit("joinChat", { userId, friendId });

    // Nhận tin nhắn real-time
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, friendId]);

  useEffect(() => {
    // Tự động cuộn xuống tin nhắn mới nhất
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("sendMessage", {
        sender: userId,
        receiver: friendId,
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
        {messages.map((msg, index) => (
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
        ))}
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