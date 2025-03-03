import React from "react";
import styles from "./Chat.module.scss"; // Import SCSS module
import SidebarChat from "~/components/Layout/SidebarChat";
import ChatBox from "~/components/ChatBox/ChatBox";

const Chat = () => {
  return (
    <div className={styles.chatContainer}>
      <div className={styles.container}>
        <SidebarChat />
        <ChatBox onClose={() => {}} /> {/* onClose để trống vì không cần đóng khi full màn */}
      </div>
    </div>
  );
};

export default Chat;