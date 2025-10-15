import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StorefrontIcon from "@mui/icons-material/Storefront";
import "./Sidebar.scss";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        setError("Không thể lấy thông tin user. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const sidebarOptions = [
    {
      src: user?.avatarImage?.[0]?.url || "https://i.pravatar.cc/150",
      title: "Trang cá nhân",
      link: user ? `/profile/${user._id}` : "/login",
    },
    { Icon: PeopleIcon, title: "Bạn bè", link: "/friend" },
    { Icon: GroupsIcon, title: "Nhóm", link: "/groups" },
    { Icon: VideoLibraryIcon, title: "Video", link: "/videos" },
    { Icon: BookmarkIcon, title: "Đã lưu", link: "/saved" },
    { Icon: StorefrontIcon, title: "Marketplace", link: "/marketplace" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="sidebar">
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          sidebarOptions.map((option, index) => (
            <Link
              to={option.link}
              key={index}
              className={`sidebarRow ${
                location.pathname === option.link ? "active" : ""
              }`}
            >
              {option.src && (
                <Avatar
                  src={option.src}
                  alt="User Avatar"
                  className="avatar"
                />
              )}
              {option.Icon && <option.Icon className="icon" />}
              <p className="title">{option.title}</p>
            </Link>
          ))
        )}
      </div>

      {/* Mobile Sidebar */}
      <div className="mobileSidebar">
        <div className="mobileSidebarContent">
          {!loading && sidebarOptions.map((option, index) => (
            <Link
              to={option.link}
              key={index}
              className={`mobileSidebarItem ${
                location.pathname === option.link ? "active" : ""
              }`}
            >
              {option.src ? (
                <img
                  src={option.src}
                  alt="User Avatar"
                  className="mobileAvatar"
                />
              ) : option.Icon ? (
                <option.Icon className="mobileIcon" />
              ) : null}
              <span className="mobileTitle">{option.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;