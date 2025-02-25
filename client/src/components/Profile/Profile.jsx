import React from "react";
import ProfileHeader from "./ProfileHeader";
import Navbar from "./Navbar";
import "./Profile.scss";
import ProfileSidebar from "./ProfileSidebar";
import ProfilePosts from "./ProfilePosts";

const Profile = () => {
    return (
      <div className="profile">
        {/* Ảnh đại diện và ảnh bìa */}
        <ProfileHeader />
  
        {/* Thanh điều hướng */}
        <Navbar />
  
        {/* Bố cục chính */}
        <div className="profile__content">
          {/* Sidebar bên trái */}
          <ProfileSidebar />
  
          {/* Bài viết bên phải */}
          <ProfilePosts />
        </div>
      </div>
    );
  };
  
  export default Profile;