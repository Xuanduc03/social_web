import React, { useState } from "react";
import FriendRequests from "~/components/Friend/FriendRequests";
import SuggestedFriends from "~/components/Friend/SuggestedFriends";
import ListFriend from "~/components/Friend/ListFriend";
import styles from "./Friend.module.scss";

const Friend = () => {
  const [activeTab, setActiveTab] = useState("friendRequests"); 

  const renderContent = () => {
    switch (activeTab) {
      case "friendRequests":
        return <FriendRequests />;
      case "suggestedFriends":
        return <SuggestedFriends />;
      case "listFriend":
        return <ListFriend />;
      default:
        return <FriendRequests />;
    }
  };

  return (
    <div className={styles.friendContainer}>
      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <ul className={styles.sidebarList}>
            <li
              className={`${styles.sidebarItem} ${
                activeTab === "friendRequests" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("friendRequests")}
            >
              Lời mời kết bạn
            </li>
            <li
              className={`${styles.sidebarItem} ${
                activeTab === "suggestedFriends" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("suggestedFriends")}
            >
              Gợi ý bạn bè
            </li>
            <li
              className={`${styles.sidebarItem} ${
                activeTab === "listFriend" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("listFriend")}
            >
              Danh sách bạn bè
            </li>
          </ul>
        </div>
        <div className={styles.friendLists}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default Friend;