import React, { useState } from 'react';
import styles from './Group.module.scss';
// MUI Icons
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';

const Group = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const groupInfo = {
    name: "React Developers Community",
    members: 24500,
    description: "Nơi giao lưu, học hỏi và chia sẻ kiến thức về ReactJS",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  };

  return (
    <div className={styles.groupContainer}>
      {/* Cover Section */}
      <div className={styles.coverSection}>
        <img src={groupInfo.coverImage} alt="Group Cover" className={styles.coverImage} />
        <div className={styles.groupHeader}>
          <h1 className={styles.groupName}>{groupInfo.name}</h1>
          <div className={styles.groupStats}>
            <span>{groupInfo.members.toLocaleString()} thành viên</span>
            <span>•</span>
            <span>1.2k bài viết mới hôm nay</span>
          </div>
          <p className={styles.groupDesc}>{groupInfo.description}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.tabs}>
          {['Bài viết', 'Thành viên', 'Sự kiện', 'Media'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab.toLowerCase() ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            <PersonAddIcon fontSize="small" /> Mời bạn bè
          </button>
          <button className={styles.actionBtn}>
            <NotificationsIcon fontSize="small" /> Bật thông báo
          </button>
          <button className={styles.actionBtn}>
            <SettingsIcon fontSize="small" /> Quản lý
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.leftColumn}>
          {/* Post Creator */}
          <div className={styles.postCreator}>
            <img
              src="https://i.pravatar.cc/40"
              alt="Avatar"
              className={styles.avatar}
            />
            <input
              type="text"
              placeholder="Bạn đang nghĩ gì?"
              className={styles.postInput}
            />
          </div>

          {/* Posts Feed */}
          <div className={styles.postsFeed}>
            {/* Thêm các bài post mẫu ở đây */}
          </div>
        </div>

        <div className={styles.rightColumn}>
          {/* Group Info */}
          <div className={styles.groupInfoBox}>
            <h3>Thông tin nhóm</h3>
            <p>{groupInfo.description}</p>
            <div className={styles.memberCount}>
              <PersonAddIcon fontSize="small" /> {groupInfo.members.toLocaleString()} thành viên
            </div>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm trong nhóm"
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Group;