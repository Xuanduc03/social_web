import React from "react";
import styles from "./FriendAddCard.module.scss";

const FriendAddCard = ({ friend, onAddFriend }) => {
  return (
    <div className={styles["friend-card"]}>
      <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
      <div className={styles["friend-info"]}>
        <h3>{friend.name}</h3>
        {friend.mutualFriends && <p>{friend.mutualFriends} bạn chung</p>}
      </div>
      <div className={styles["friend-actions"]}>
        <button className={styles.confirm} onClick={onAddFriend}>
          Thêm bạn bè
        </button>
        <button className={styles.remove}>Xóa</button>
      </div>
    </div>
  );
};

export default FriendAddCard;