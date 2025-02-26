import React from "react";
import { Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StorefrontIcon from "@mui/icons-material/Storefront";
import "./Sidebar.scss";

const Sidebar = () => {
  const userAvatar = "https://i.pravatar.cc/150"; // Avatar giả định, thay bằng ảnh từ API

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
          {option.src && <Avatar src={option.src} />}
          {option.Icon && <option.Icon />}
          <p>{option.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
