import React, { useEffect, useState ,useTransition } from "react";
import styles from "./SidebarChat.module.scss";
import classNames from "classnames/bind";
import axios from "axios";

const cx = classNames.bind(styles);

const SidebarChat = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/all-friends", {
          withCredentials: true,
        });
        startTransition(() => {
          setFriends(res.data);
        });
      } catch (error) {
        console.log("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  if (loading) {
    return (
      <div className={cx("container")}>
        <div className={cx("skeleton-loading")}>
          {/* Thêm các phần tử skeleton giống layout thật */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className={cx("skeleton-item")}></div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={cx("container")}>
      <div className={cx("logo")}>
        <img
        src=""
          alt="Logo"
        />
        <h1>Đoạn chat</h1>
      </div>
      <div className={cx("searchBar")}>
        <input type="text" placeholder="Tìm kiếm..." />
      </div>
      <div className={cx("chatList")}>
        {loading ? (
          <p className={cx("loading")}>Đang tải...</p>
        ) : friends.length > 0 ? (
          friends.map((user) => (
            <div
              key={user._id}
              className={cx("chatItem")}
              onClick={() => onSelectFriend(user)}
            >
              <div className={cx("avatar")}>
                <img
                  src={user?.avatarImage[0].url || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <span className={cx("statusDot", { active: true })}></span>
              </div>
              <div className={cx("chatInfo")}>
                <h4>{user.firstName} {user.lastName}</h4>
                <p>Last message...</p> {/* Thay bằng lastMessage từ Conversation nếu có */}
              </div>
            </div>
          ))
        ) : (
          <p className={cx("empty")}>Không có liên hệ nào</p>
        )}
      </div>
      <div className={cx("footer")}>
        <button>Chat mới</button>
      </div>
    </div>
  );
};

export default SidebarChat;