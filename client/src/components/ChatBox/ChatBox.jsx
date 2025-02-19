import React from "react";
import styles from "./ChatBox.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ChatBox = () => {
  return (
    <div className={cx("container")}> 
      {/* Header */}
      <div className={cx("header")}> 
        <div className={cx("userInfo")}> 
          <div className={cx("avatar")}>
            <img src="https://via.placeholder.com/40" alt="User Avatar" />
          </div>
          <div>
            <h4>John Doe</h4>
            <p>Active now</p>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className={cx("messages")}> 
        <div className={cx("messageWrapper")}> 
          <div className={cx("message", "received")}>
            <p>Hello! How are you?</p>
          </div>
        </div>
        <div className={cx("messageWrapper")}> 
          <div className={cx("message", "sent")}>
            <p>I'm doing great! What about you?</p>
          </div>
        </div>
        <div className={cx("messageWrapper")}> 
          <div className={cx("message", "received")}>
            <p>I'm good too! Thanks for asking.</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className={cx("inputArea")}> 
        <div className={cx("inputBox")}> 
          <input type="text" placeholder="Type a message..." />
          <button className={cx("sendButton")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20px"
              height="20px"
            >
              <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
