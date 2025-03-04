import React from "react";
import styles from "./FriendCard.module.scss";

const FriendCard = ({ friend, onConfirm, onRemove }) => {
  return (
    <div className={styles["friend-card"]}>
      <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
      <div className={styles["friend-info"]}>
        <h3>{friend.name}</h3>
        {friend.mutualFriends && <p>{friend.mutualFriends} bạn chung</p>}
      </div>
      <div className={styles["friend-actions"]}>
        <button className={styles.confirm} onClick={onConfirm}>
          Xác nhận
        </button>
        <button className={styles.remove} onClick={onRemove}>
          Xóa
        </button>
      </div>
    </div>
  );
};

export default FriendCard;