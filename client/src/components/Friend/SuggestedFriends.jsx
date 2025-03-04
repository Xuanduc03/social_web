import React from "react";
import styles from "./SuggestedFriends.module.scss";
import FriendAddCard from "./FriendAddCard";

const SuggestedFriends = () => {
  const suggestedFriends = [
    { id: 1, name: "User", avatar: "https://i.pravatar.cc/154" },
    { id: 2, name: "User", avatar: "https://i.pravatar.cc/155" },
    { id: 3, name: "User", avatar: "https://i.pravatar.cc/156" },
    { id: 4, name: "User", avatar: "https://i.pravatar.cc/157", mutualFriends: 2 },
    { id: 5, name: "User", avatar: "https://i.pravatar.cc/158" },
    { id: 6, name: "User", avatar: "https://i.pravatar.cc/159" }
  ];

  return (
    <div className={styles["suggested-friends"]}>
      <h2>Những người bạn có thể biết</h2>
      <div className={styles["suggested-list"]}>
        {suggestedFriends.map((friend) => (
          <FriendAddCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedFriends;
