import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import ProfileHeader from "~/components/Profile/ProfileHeader";
import ProfileSidebar from "~/components/Profile/ProfileSidebar";
import Post from "~/components/Post/Post";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams(""); // Lấy userId từ URL
  const [activeTab, setActiveTab] = useState("posts"); // Tab mặc định là "Bài viết"
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
        if (response.data.success) {
          setPosts(response.data.data);
          console.log(response.data.data)
        } else {
          console.error("Không thể lấy bài viết!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };

    if (userId) {
      fetchUserPosts();
    }
  }, [userId]);

  return (
    <div className={styles.profile}>
      {/* Ảnh đại diện & ảnh bìa */}
      <ProfileHeader />

      {/* Thanh điều hướng Profile */}
      <div className={styles.profileNav}>
        <ul className={styles.navLinks}>
          <li
            className={activeTab === "posts" ? styles.active : ""}
            onClick={() => setActiveTab("posts")}
          >
            Bài viết
          </li>
          <li
            className={activeTab === "about" ? styles.active : ""}
            onClick={() => setActiveTab("about")}
          >
            Giới thiệu
          </li>
          <li
            className={activeTab === "friends" ? styles.active : ""}
            onClick={() => setActiveTab("friends")}
          >
            Bạn bè
          </li>
          <li
            className={activeTab === "photos" ? styles.active  : ""}
            onClick={() => setActiveTab("photos")}
          >
            Ảnh
          </li>
          <li
            className={activeTab === "videos" ? styles.active : ""}
            onClick={() => setActiveTab("videos")}
          >
            Video
          </li>
        </ul>
      </div>

      {/* Bố cục chính */}
      <div className={styles.profileContent}>
        {/* Sidebar bên trái */}
        <ProfileSidebar />

        {/* Nội dung của từng tab */}
        <div className={styles.tabContent}>
          {activeTab === "posts" && <PostsTab posts={posts} />}
          {activeTab === "about" && <AboutTab />}
          {activeTab === "friends" && <FriendsTab />}
          {activeTab === "photos" && <PhotosTab posts={posts}/>}
          {activeTab === "videos" && <VideosTab />}
        </div>
      </div>
    </div>
  );
};

// **🔥 Tạo các Component cho từng Tab**
const PostsTab = ({ posts }) => (
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
          images={post.images?.length > 0 ? post.images : ""}
          likes={post.likes}
          comments={post.comments || []}
        />
      ))
    ) : (
      <p>Người dùng chưa có bài viết nào!</p>
    )}
  </div>
);

const AboutTab = () => <div>📝 Đây là tab Giới thiệu</div>;
const FriendsTab = () => <div>👥 Đây là tab Bạn bè</div>;
const PhotosTab = ({ posts }) => {
  if (!Array.isArray(posts)) {
    return <p>📸 Không có dữ liệu bài viết!</p>;
  }

  // Lọc ảnh từ tất cả bài viết
  const allPhotos = posts
    .filter((post) => Array.isArray(post.images) && post.images.length > 0) // Chỉ lấy post có ảnh
    .flatMap((post) => post.images.map((img) => img.url)); // Lấy danh sách URL ảnh

  return (
    <div className={styles.photosTab}>
      {allPhotos.length > 0 ? (
        <div className={styles.photosGrid}>
          {allPhotos.map((url, index) => (
            <img key={index} src={url} alt={`Ảnh ${index}`} className={styles.photoItem} />
          ))}
        </div>
      ) : (
        <p>📸 Người dùng chưa có ảnh nào!</p>
      )}
    </div>
  );
};


const VideosTab = () => <div>🎥 Đây là tab Video</div>;

export default Profile;
