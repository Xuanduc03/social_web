import React, { useEffect, useState } from "react";
import styles from "./Rightsidebar.module.scss"; // Import CSS Module
import CircleIcon from '@mui/icons-material/Circle'; // Icon trạng thái online
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:8080", { withCredentials: true, transports: ["websocket"], });

function Rightsidebar() {
  const [friends, setFriends] = useState(null);
  const [loading, setLoading] = useState("");
  const [modalOpen, setModalOpen] = useState(false);


  // Lấy danh sách bạn bè ban đầu
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/all-friends", { withCredentials: true });
        
        setFriends(res.data.map(friend => ({
          ...friend,
          statusOnline: friend.statusOnline  // Khởi tạo trạng thái ban đầu
        })));
        setLoading(false);
      } catch (error) {
        console.log("Error fetching friends:", error);
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    socket.on("SERVER_INITIAL_ONLINE_USERS", (onlineUserIds) => {
      setFriends(prevFriends => {
        if (!Array.isArray(prevFriends)) return prevFriends; // Tránh lỗi khi chưa có dữ liệu
        return prevFriends.map(friend =>
          onlineUserIds.includes(friend._id)
            ? { ...friend, statusOnline: "online" }
            : { ...friend, statusOnline: "offline" }
        );
      });
    });
  
    return () => {
      socket.off("SERVER_INITIAL_ONLINE_USERS");
    };
  }, []);
  

  // Lắng nghe sự kiện user online từ server
  useEffect(() => {
    socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
      setFriends(prevFriends => {
        // Cập nhật trạng thái online cho người dùng tương ứng
        return prevFriends.map(friend =>
          friend._id === userId
            ? { ...friend, statusOnline: "online" }
            : friend
        );
      });
    });
    // Dọn dẹp khi component unmount
    return () => {
      socket.off("SERVER_RETURN_USER_ONLINE");
    };
  }, []);

  // Lắng nghe sự kiện user offline từ server
  useEffect(() => {
    socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
      setFriends(prevFriends => {
        if (!Array.isArray(prevFriends)) return prevFriends;
        return prevFriends.map(friend =>
          friend._id === userId
            ? { ...friend, statusOnline: "offline" }
            : friend
        );
      });
    });
  
    return () => {
      socket.off("SERVER_RETURN_USER_OFFLINE");
    };
  }, []);



  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <h4>Người liên hệ</h4>
      </div>
      <div className={styles.widgetContacts}>
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((user) => (
<div key={user._id} className={styles.contactItem}>
              <div className={styles.avatarWrapper}>
                <img
                  src={user?.avatarImage[0].url || "/default-avatar.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className={styles.contactAvatar}
                />
                {/* <CircleIcon className={styles.onlineIcon} /> */}
                <CircleIcon
                  className={styles.onlineIcon}
                  style={{ color: user.statusOnline === "online" ? "green" : "grey" }}
                />
              </div>
              <p>{user.firstName} {user.lastName}</p>
            </div>
          ))
        ) : (
          <p>Không có liên hệ nào</p>
        )}


      </div>
    </div>
  );
}

export default Rightsidebar;
