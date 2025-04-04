import React, { useState, useEffect } from "react";
import styles from "./ListFriend.module.scss"; // Tạo file SCSS mới
import FriendCard from "./FriendCard";
import axios from "axios";
import { toast } from "react-toastify";

const ListFriend = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/all-friends", {
          withCredentials: true,
        });
        setFriends(response.data); // API trả về danh sách bạn bè trực tiếp
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId) => {
    try {

      const response = await axios.post(
        "http://localhost:8080/api/remove-friend",
        { friendId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Đã xóa bạn bè thành công!");
        setFriends(friends.filter((f) => f._id !== friendId));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi khi xóa bạn bè!";
      toast.error(errorMessage);
      console.error("Error removing friend:", error.response?.data || error.message);
    }
  };

  return (
    <div className={styles["list-friends"]}>
      <h2>Danh sách bạn bè</h2>
      <div className={styles["friends-list"]}>
        {friends.map((friend) => (
          <FriendCard
            key={friend._id}
            friend={{
              id: friend._id,
              name: `${friend.firstName} ${friend.lastName}`,
              avatar: friend.avatarImage[0].url || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
              mutualFriends: friend.mutualFriends, // Nếu bạn muốn hiển thị bạn chung
            }}
            onConfirm={null} // Không cần nút "Xác nhận"
            onRemove={() => handleRemoveFriend(friend._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ListFriend;