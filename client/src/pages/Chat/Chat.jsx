import React, { useState } from "react";
import styles from "./Chat.module.scss";
import SidebarChat from "~/components/Layout/SidebarChat";
import ChatBox from "~/components/ChatBox/ChatBox";

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.container}>
        <SidebarChat onSelectFriend={setSelectedFriend} />
        {selectedFriend ? (
          <ChatBox
            userId="currentUserId" // Thay bằng ID người dùng hiện tại (lấy từ auth)
            friendId={selectedFriend._id}
            friendName={`${selectedFriend.firstName} ${selectedFriend.lastName}`}
            friendAvatar={selectedFriend.avatarImage}
            onClose={() => setSelectedFriend(null)} // Đóng ChatBox bằng cách xóa selectedFriend
          />
        ) : (
          <div className={styles.noChat}>
            <p>Chọn một người bạn để bắt đầu trò chuyện!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;