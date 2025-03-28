import React, { useEffect, useState } from "react";
import styles from "./SidebarChat.module.scss";
import classNames from "classnames/bind";
import axios from "axios";

const cx = classNames.bind(styles);

const SidebarChat = ({ onSelectFriend }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/all-friends", {
          withCredentials: true,
        });
        setFriends(res.data);
      } catch (error) {
        console.log("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  return (
    <div className={cx("container")}>
      <div className={cx("logo")}>
        <img
          src="https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/459026421_1231801741296134_6024370460723247118_n.jpg?stp=cp6_dst-jpg_s960x960_tt6&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=EQD30nV6vTAQ7kNvgGBjFrk&_nc_oc=Adj2H5-TnwhpTeBvUi-RlRYvqe7KX2FN_PMG2buwK8LTU0ngBX_kaKDv7Hm-nP9KVw0&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=ADl29HWWbSspNvBwQNl5Zvj&oh=00_AYCXYCeD6RY_oTJMUYDZj_Yb0byeo5tT80kX1WzF3FFoSA&oe=67B0E458"
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
                  src={user.avatarImage || "https://via.placeholder.com/40"}
                  alt={`${user.firstName} ${user.lastName}`}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
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