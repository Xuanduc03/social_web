import React from "react";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <div className="profile-nav">
      <ul className="nav-links">
        <li className="active">Bài viết</li>
        <li>Giới thiệu</li>
        <li>Bạn bè</li>
        <li>Ảnh</li>
        <li>Video</li>
        <li>Check in</li>
        <li>Xem thêm ▾</li>
      </ul>
      <div className="nav-actions">
        <button className="settings">⚙ Quản lý</button>
        <button className="filter">🛠 Bộ lọc</button>
      </div>
    </div>
  );
};

export default Navbar;
