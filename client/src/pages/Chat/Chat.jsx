import React, { useState, useEffect } from "react";
import styles from "./Chat.module.scss";
import SidebarChat from "~/components/Layout/SidebarChat";
import ChatBox from "~/components/ChatBox/ChatBox";
import axios from "axios";

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  // Lấy thông tin user hiện tại
      useEffect(() => {
          const fetchUser = async () => {
              try {
                  const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, { withCredentials: true });
                  if (response.data.success) {
                      setUserId(response.data.data._id);
                  }
              } catch (error) {
                  console.error("Lỗi lấy thông tin user:", error);
              } finally {
                  setLoading(false);
              }
          };
          fetchUser();
      }, []);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.container}>
        <SidebarChat onSelectFriend={setSelectedFriend} />
        {selectedFriend ? (
          <ChatBox
            userId={userId} // Thay bằng ID người dùng hiện tại (lấy từ auth)
            friendId={selectedFriend._id}
            friendName={`${selectedFriend.firstName} ${selectedFriend.lastName}`}
            friendAvatar={selectedFriend.avatarImage[0].url}
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