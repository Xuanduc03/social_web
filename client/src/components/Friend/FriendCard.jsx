import React from "react";
import styles from "./FriendCard.module.scss";

const FriendCard = ({ friend }) => {
  return (
    <div className={styles["friend-card"]}>
      <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
      <div className={styles["friend-info"]}>
        <h3>{friend.name}</h3>
        {friend.mutualFriends && <p>{friend.mutualFriends} bạn chung</p>}
      </div>
      <div className={styles["friend-actions"]}>
        <button className={styles.confirm}>Xác nhận</button>
        <button className={styles.remove}>Xóa</button>
      </div>
    </div>
  );
};

export default FriendCard;
