import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import ProfileHeader from "~/components/Profile/ProfileHeader";
import ProfileSidebar from "~/components/Profile/ProfileSidebar";
import Post from "~/components/Post/Post";
import axios from "axios";
import { useParams } from "react-router-dom"; // Để lấy ID từ URL
const Profile = () => {
  
  const { userId } = useParams(""); // Lấy userId từ URL
  const [posts, setPosts] = useState([]);


 // Gọi API để lấy bài viết theo ID người dùng
 useEffect(() => {
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
      if (response.data.success) {
        setPosts(response.data.data);
      } else {
        console.error("Không thể lấy bài viết!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
    }
  };

  fetchUserPosts();
}, [userId]);
 
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
        {posts.length > 0 ? (
            posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                photoURL={post.user?.avatarImage || ""}
                username={`${post.user?.firstName} ${post.user?.lastName}`}
                time={new Date(post.createdAt).toLocaleString()}
                message={post.content}
                image={post.images?.length > 0 ? post.images[0].url : ""}
                comments={post.comments || []}
              />
            ))
          ) : (
            <p>Người dùng chưa có bài viết nào!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;