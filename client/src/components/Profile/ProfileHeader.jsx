import React from "react";
import "./ProfileHeader.scss";

const ProfileHeader = () => {
  return (
    <div className="profile-header">
      <div className="cover-photo">
        <button className="edit-cover">Thêm ảnh bìa</button>
      </div>
      <div className="profile-info">
        <div className="avatar-container">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlpgOzwjh3d5VTbE4aqLWMaSSCIb7Xlj3aw&s"
            alt="Avatar"
            className="avatar"
          />
          <button className="edit-avatar">📷</button>
        </div>
        <div className="info">
          <h1 className="name">User Name</h1>
          <p className="friends-count">Friend</p>
        </div>
        <div className="actions">
          <button className="add-story">+ Thêm vào tin</button>
          <button className="edit-profile">✏ Chỉnh sửa trang cá nhân</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
