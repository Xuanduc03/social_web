import React from "react";
import FriendRequests from "~/components/Friend/FriendRequests";
import SuggestedFriends from "~/components/Friend/SuggestedFriends";
import styles from "./Friend.module.scss";

const Friend = () => {
  return (
    <div className={styles.friendContainer}>
      <div className={styles.mainContent}>
        <div className={styles.friendContent}>
          <FriendRequests />
          <SuggestedFriends />
        </div>
      </div>
    </div>
  );
};

export default Friend;
