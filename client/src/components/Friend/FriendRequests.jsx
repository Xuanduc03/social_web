import React, { useState, useEffect } from "react";
import styles from "./FriendRequests.module.scss";
import FriendCard from "./FriendCard";
import axios from "axios";
import { toast } from "react-toastify";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/friend-requests`, {
          withCredentials: true,
        });
        setFriendRequests(response.data.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchFriendRequests();
  }, []);

  const handleConfirm = async (friendId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/accept-friend-request`,
        { friendId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Đã chấp nhận lời mời kết bạn!");
        setFriendRequests(friendRequests.filter((f) => f.user._id !== friendId));
      }
    } catch (error) {
      toast.error("Lỗi khi chấp nhận lời mời!");
    }
  };

  const handleRemove = async (friendId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/reject-friend-request`,
        { friendId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Đã xóa lời mời kết bạn!");
        setFriendRequests(friendRequests.filter((f) => f.user._id !== friendId));
      }
    } catch (error) {
      toast.error("Lỗi khi xóa lời mời!");
    }
  };

  return (
    <div className={styles["friend-requests"]}>
      <h2>Lời mời kết bạn</h2>
      <div className={styles["requests-list"]}>
        {friendRequests.map((request) => (
          <FriendCard
            key={request.user._id}
            friend={{
              id: request.user._id,
              name: `${request.user.firstName} ${request.user.lastName}`,
              avatar: request.user?.avatarImage?.[0]?.url || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",              mutualFriends: request.mutualFriends,
            }}
            onConfirm={() => handleConfirm(request.user._id)}
            onRemove={() => handleRemove(request.user._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;