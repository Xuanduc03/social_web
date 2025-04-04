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
  const [userProfile, setUserProfile] = useState(null); // Thêm state cho user
  const [loading, setLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userResponse = await axios.get(`http://localhost:8080/api/user/${userId}`, {
          withCredentials: true,
        });
        const postsResponse = await axios.get(`http://localhost:8080/api/posts/user/${userId}`, {
          withCredentials: true,
        });

        if (userResponse.data.success) setUserProfile(userResponse.data.data);
        if (postsResponse.data.success) setPosts(postsResponse.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfileData();
  }, [userId]);

  return (
    <div className={styles.profile}>
      {/* Ảnh đại diện & ảnh bìa */}
      <ProfileHeader user={userProfile} loading={loading}/>
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
            className={activeTab === "photos" ? styles.active : ""}
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
          {activeTab === "photos" && <PhotosTab posts={posts} />}
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
          photoURL={post.user?.avatarImage[0].url || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
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

const AboutTab = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
        if (response.data.success) {
          setUserInfo(response.data.data);
        } else {
          console.error("Không thể lấy thông tin cá nhân!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <p>⏳ Đang tải thông tin...</p>;
  }

  if (!userInfo) {
    return <p>❌ Không tìm thấy thông tin cá nhân!</p>;
  }

  return (
    <div className={styles.aboutContent}>
      <ul className={styles.infoList}>
        <li>
          <i className="fas fa-user"></i>
          Họ và tên: <strong>{userInfo.firstName} {userInfo.lastName}</strong>
        </li>
        <li>
          <i className="fas fa-briefcase"></i>
          Công việc: <strong>{userInfo.job || "Chưa cập nhật"}</strong>
        </li>
        <li>
          <i className="fas fa-home"></i>
          Sống tại: <strong>{userInfo.address || "Chưa cập nhật"}</strong>
        </li>
        <li>
          <i className="fas fa-heart"></i>
          Tình trạng: <strong>
            {userInfo.maritalStatus === "single"
              ? "Độc thân"
              : userInfo.maritalStatus === "married"
                ? "Đã kết hôn"
                : "Đã ly hôn"}
          </strong>
        </li>
        <li>
          <i className="fas fa-phone"></i>
          Số điện thoại: <strong>{userInfo.phone || "Chưa cập nhật"}</strong>
        </li>
        <li>
          <i className="fas fa-birthday-cake"></i>
          Ngày sinh: <strong>{new Date(userInfo.birthday).toLocaleDateString("vi-VN")}</strong>
        </li>
        <li>
          <i className="fas fa-info-circle"></i>
          Giới thiệu: <strong>{userInfo.bio || "Chưa có tiểu sử"}</strong>
        </li>
        <li>
          <i className="fas fa-link"></i>
          Mạng xã hội: {userInfo.socialLinks ? (
            <a href={userInfo.socialLinks} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          ) : (
            <span>Chưa cập nhật</span>
          )}
        </li>
      </ul>
    </div>
  );
};


const FriendsTab = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/all-friends", {
          withCredentials: true,
        });
        setFriends(res.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể lấy danh sách bạn bè.");
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const handleDeleteFriend = async (friendId) => {
    if (window.confirm("Bạn có chắc muốn xóa bạn bè này không?")) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/remove-friend",
          { friendId },
          { withCredentials: true }
        );
        if (response.data.success) {
          setFriends(friends.filter((friend) => friend._id !== friendId));
          console.log(`Đã xóa bạn bè với ID: ${friendId}`);
        }
      } catch (err) {
        setError("Không thể xóa bạn bè. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className={styles.friendsTab}>
      {loading ? (
        <p className={styles.loading}>⏳ Đang tải danh sách bạn bè...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <div className={styles.friendsList}>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className={styles.friendItem}>
                <img
                  src={friend.avatarImage[0].url || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                  alt={`${friend.firstName} ${friend.lastName}`}
                  className={styles.friendAvatar}
                  onError={(e) => (e.target.src = "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg")}
                />
                <span className={styles.friendName}>
                  {`${friend.firstName} ${friend.lastName}`}
                </span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteFriend(friend._id)}
                >
                  <i className="fas fa-trash-alt"></i> Xóa
                </button>
              </div>
            ))
          ) : (
            <p className={styles.empty}>👤 Chưa có bạn bè nào!</p>
          )}
        </div>
      )}
    </div>
  );
};



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
