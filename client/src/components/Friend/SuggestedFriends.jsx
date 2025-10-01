import React, { useState, useEffect } from "react";
import styles from "./SuggestedFriends.module.scss";
import FriendAddCard from "./FriendAddCard";
import axios from "axios";
import { toast } from "react-toastify";

const SuggestedFriends = () => {
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/suggested-friends`, {
          withCredentials: true,
        });
        setSuggestedFriends(response.data.data);
      } catch (error) {
        console.error("Error fetching suggested friends:", error);
      }
    };
    fetchSuggestedFriends();
  }, []);

  const handleAddFriend = async (friendId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send-friend-request`,
        { friendId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Đã gửi lời mời kết bạn!");
        setSuggestedFriends(suggestedFriends.filter((f) => f._id !== friendId));
      }
    } catch (error) {
      toast.error("Lỗi khi gửi lời mời!");
    }
  };

  return (
    <div className={styles["suggested-friends"]}>
      <h2>Những người bạn có thể biết</h2>
      <div className={styles["suggested-list"]}>
        {suggestedFriends.map((friend) => (
          <FriendAddCard
            key={friend._id}
            friend={{
              id: friend._id,
              name: `${friend.firstName} ${friend.lastName}`,
              avatar: friend ?.avatarImage?.[0]?.url || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
              mutualFriends: friend.mutualFriends,
            }}
            onAddFriend={() => handleAddFriend(friend._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriends;