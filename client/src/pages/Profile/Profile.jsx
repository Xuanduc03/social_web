import React from "react";
import styles from "./Profile.module.scss";
import ProfileHeader from "~/components/Profile/ProfileHeader";
import ProfileSidebar from "~/components/Profile/ProfileSidebar";
import Post from "~/components/Post/Post";

const Profile = () => {
  return (
    <div className={styles.profile}>
      {/* Ảnh đại diện & ảnh bìa */}
      <ProfileHeader />

      {/* Thanh điều hướng Profile */}
      <div className={styles.profileNav}>
        <ul className={styles.navLinks}>
          <li className={styles.active}>Bài viết</li>
          <li>Giới thiệu</li>
          <li>Bạn bè</li>
          <li>Ảnh</li>
          <li>Video</li>
          <li>Xem thêm ▾</li>
        </ul>
        <div className={styles.navActions}>
          <button className={styles.settings}>⚙ Quản lý</button>
          <button className={styles.filter}>🛠 Bộ lọc</button>
        </div>
      </div>

      {/* Bố cục chính */}
      <div className={styles.profileContent}>
        {/* Sidebar bên trái */}
        <ProfileSidebar />

        {/* Danh sách bài viết */}
        <div className={styles.postSection}>
          <Post />
          <Post />
          <Post />
        </div>
      </div>
    </div>
  );
};

export default Profile;
