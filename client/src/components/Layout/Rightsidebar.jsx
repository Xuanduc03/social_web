import React, { useEffect, useState } from "react";
import styles from "./Rightsidebar.module.scss"; // Import CSS Module
import CircleIcon from '@mui/icons-material/Circle'; // Icon trạng thái online
import axios from "axios";

function Rightsidebar() {
  const [friends, setFriends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      const res = await axios.get("http://localhost:8080/api/all-friends", {
        withCredentials: true
      });
      setFriends(res.data);
    };
    fetchFriends();
  }, []);

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <h4>Người liên hệ</h4>
      </div>
      <div className={styles.widgetContacts}>
        {Array.isArray(friends) && friends.length > 0 ? (
          friends.map((user) => (
            <div key={user._id} className={styles.contactItem}>
              <div className={styles.avatarWrapper}>
                <img
                  src={user.avatarImage || "/default-avatar.png"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className={styles.contactAvatar}
                />
                <CircleIcon className={styles.onlineIcon} />
              </div>
              <p>{user.firstName} {user.lastName}</p>
            </div>
          ))
        ) : (
          <p>Không có liên hệ nào</p>
        )}


      </div>
    </div>
  );
}

export default Rightsidebar;
