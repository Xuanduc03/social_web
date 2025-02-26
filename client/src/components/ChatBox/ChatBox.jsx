import React, { useState } from "react";
import styles from "./ChatBox.module.scss";
import classNames from "classnames/bind";
import { Avatar, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const cx = classNames.bind(styles);

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How are you?", sender: "received" },
    { id: 2, text: "I'm doing great! What about you?", sender: "sent" },
    { id: 3, text: "I'm good too! Thanks for asking.", sender: "received" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "sent" }]);
      setNewMessage("");
    }
  };

  return (
    <div className={cx("chatBox")}>
      {/* Header */}
      <div className={cx("chatHeader")}>
        <div className={cx("userInfo")}>
          <Avatar src="https://via.placeholder.com/40" />
          <div>
            <h4>John Doe</h4>
            <p>Active now</p>
          </div>
        </div>
        <div className={cx("headerActions")}>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      {/* Message Area */}
      <div className={cx("chatBody")}>
        {messages.map((msg) => (
          <div key={msg.id} className={cx("messageWrapper", msg.sender)}>
            <div className={cx("message")}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className={cx("chatFooter")}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton onClick={sendMessage}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatBox;
