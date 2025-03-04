import React from "react";
import styles from "./FriendRequests.module.scss"; // Import module SCSS
import FriendCard from "./FriendCard";

const FriendRequests = () => {
  const friendRequests = [
    { id: 1, name: "User", avatar: "https://i.pravatar.cc/150", mutualFriends: 3 },
    { id: 2, name: "User", avatar: "https://i.pravatar.cc/151", mutualFriends: 1 },
    { id: 3, name: "User", avatar: "https://i.pravatar.cc/152", mutualFriends: 1 },
    { id: 4, name: "User", avatar: "https://i.pravatar.cc/153", mutualFriends: 2 }
  ];

  return (
    <div className={styles["friend-requests"]}>
      <h2>Lời mời kết bạn</h2>
      <div className={styles["requests-list"]}>
        {friendRequests.map((friend) => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
};

export default FriendRequests;
