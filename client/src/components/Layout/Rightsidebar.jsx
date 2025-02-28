import React from "react";
import styles from "./Rightsidebar.module.scss"; // Import CSS Module
import CircleIcon from '@mui/icons-material/Circle'; // Icon trạng thái online

const users = [
  { id: 1, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Phạm Văn C", avatar: "https://i.pravatar.cc/150?img=3" }
];

function Rightsidebar() {
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <h4>Người liên hệ</h4>
      </div>
      <div className={styles.widgetContacts}>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className={styles.contactItem}>
              <div className={styles.avatarWrapper}>
                <img src={user.avatar} alt={user.name} className={styles.contactAvatar} />
                <CircleIcon className={styles.onlineIcon} />
              </div>
              <p>{user.name}</p>
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
