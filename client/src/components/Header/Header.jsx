import React, { useState } from "react";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SummaryApi from "../../utils/APIRoutes";
import { toast } from "react-toastify";
import styles from "./Header.module.scss"; // Import SCSS module

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    const response = await axios({
      url: SummaryApi.Logout.url,
      method: SummaryApi.Logout.method,
      withCredentials: "true"
    });

    const result = await response.data;

    if (result.success) {
      toast.success(response.message);
      navigate("/login");
    }
    if (result.error) {
      toast.error(result.message);
    }
  };

  return (
    <nav className={styles.navbarContainer}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <img className={styles.imgLogo} src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/1200px-Facebook_Messenger_logo_2020.svg.png" alt="logo" />
        </div>
        <div className={styles.searchBar}>
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm trên Facebook" />
        </div>
      </div>

      {/* Center Section */}
      <div className={styles.centerSection}>
        <div className={styles.iconButton}>
          <Tippy content="Trang chủ" interactive={true} interactiveBorder={30} delay={100}>
            <Link to={'/'}><i className="fas fa-home"></i></Link>
          </Tippy>
        </div>
        <div className={styles.iconButton}>
          <i className="fas fa-tv"></i>
          <div className={styles.notificationDot}></div>
        </div>
        <div className={styles.iconButton}>
          <i className="fas fa-store"></i>
        </div>
        <div className={styles.iconButton}>
          <Tippy content="Bạn bè" interactive={true} interactiveBorder={30} delay={100}>
            <i className="fas fa-users"></i>
          </Tippy>
        </div>
        <div className={styles.iconButton}>
          <i className="fas fa-gamepad"></i>
        </div>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        <div className={styles.iconButton}>
          <i className="fas fa-th"></i>
        </div>
        <div className={styles.iconButton}>
          <i className="fas fa-bell"></i>
          <div className={styles.notificationDot}></div>
        </div>
        <div className={styles.avatar} onClick={toggleDropdown}></div>
        <div className={styles.dropdown}>
          <i className="fas fa-chevron-down"></i>
          <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.open : ""}`}>
            <ul>
              <li>Profile</li>
              <Link to={'/avatar'}>Chọn ảnh đại diện</Link>
              <Link to={'/login'}>Đăng nhập</Link>
              <li onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
