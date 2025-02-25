/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./ProfileSidebar.scss";

const ProfileSidebar = () => {
  return (
    <div className="profile-sidebar">
      <div className="sidebar-section">
        <h3>Giới thiệu</h3>
        <p>Đây là phần giới thiệu ngắn về người dùng.</p>
        <button>Chỉnh sửa chi tiết</button>
      </div>
      
      <div className="sidebar-section">
        <h3>Ảnh</h3>
        <div className="photos-grid">
          <img src="https://via.placeholder.com/80" alt="Ảnh 1" />
          <img src="https://via.placeholder.com/80" alt="Ảnh 2" />
          <img src="https://via.placeholder.com/80" alt="Ảnh 3" />
        </div>
        <a href="#">Xem tất cả ảnh</a>
      </div>

      <div className="sidebar-section">
        <h3>Bạn bè</h3>
        <p>Count Friend</p>
        <a href="#">Xem tất cả bạn bè</a>
      </div>
    </div>
  );
};

export default ProfileSidebar;
