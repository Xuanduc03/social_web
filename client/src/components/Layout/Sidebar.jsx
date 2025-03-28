import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StorefrontIcon from "@mui/icons-material/Storefront";
import styles from "./Sidebar.module.scss"; // Chuyển sang SCSS module
import axios from "axios";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/me", {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          console.log("Không lấy được thông tin user:", response.data.message);
        }
      } catch (error) {
        console.log(
          "Lỗi khi lấy thông tin:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const sidebarOptions = [
    {
      src: user?.avatarImage || "https://i.pravatar.cc/150",
      title: "Trang cá nhân",
      link: `/profile/`,
    },
    { Icon: PeopleIcon, title: "Bạn bè", link: "/friend" },
    { Icon: GroupsIcon, title: "Nhóm", link: "/groups" },
    { Icon: VideoLibraryIcon, title: "Video", link: "/videos" },
    { Icon: BookmarkIcon, title: "Đã lưu", link: "/saved" },
    { Icon: StorefrontIcon, title: "Marketplace", link: "/marketplace" },
  ];

  return (
    <div className={styles.sidebar}>
      {loading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : (
        sidebarOptions.map((option, index) => (
          <Link
            to={option.link}
            key={index}
            className={styles.sidebarRow}
          >
            {option.src && (
              <Avatar
                src={option.src}
                alt="User Avatar"
                className={styles.avatar}
              />
            )}
            {option.Icon && <option.Icon className={styles.icon} />}
            <p className={styles.title}>{option.title}</p>
          </Link>
        ))
      )}
    </div>
  );
};

export default Sidebar;