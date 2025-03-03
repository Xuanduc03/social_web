import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StorefrontIcon from "@mui/icons-material/Storefront";
import "./Sidebar.scss";
import axios from "axios";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const userAvatar = "https://i.pravatar.cc/150"; // Avatar giả định, thay bằng ảnh từ API

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchUser = async () => {
          try {
              const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
              if (response.data.success) {
                  setUser(response.data.data);
              } else {
                  console.log("Không lấy được thông tin user:", response.data.message);
              }
          } catch (error) {
              console.log("Lỗi khi lấy thông tin:", error.response?.data || error.message);
          } finally {
              setLoading(false); // Đặt loading thành false khi hoàn tất
          }
      };
      fetchUser();
  }, []);
  const sidebarOptions = [
    { src: userAvatar, title: "Trang cá nhân" },
    { Icon: PeopleIcon, title: "Bạn bè" },
    { Icon: GroupsIcon, title: "Nhóm" },
    { Icon: VideoLibraryIcon, title: "Video" },
    { Icon: BookmarkIcon, title: "Đã lưu" },
    { Icon: StorefrontIcon, title: "Marketplace" },
  ];

  return (
    <div className="sidebar">
      {sidebarOptions.map((option, index) => (
        <div key={index} className="sidebarRow">
          {option.src && <Link to={'/profile'}><Avatar src={loading ? "loading..." : (user? user.avatarImage : "anh")} /></Link> }
          {option.Icon && <option.Icon />}
          <p>{option.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
