/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "./ProfileSidebar.scss";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProfileSidebar = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // Gọi API để lấy bài viết theo ID người dùng
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

    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`, { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          console.log("Không lấy được thông tin user:", response.data.message);
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="profile-sidebar">
      <div className="sidebar-section">
        <h3>Giới thiệu</h3>
        <p>Đây là phần giới thiệu ngắn về người dùng.</p>
        <button>Chỉnh sửa chi tiết</button>
      </div>

      <div className="sidebar-section">
        <h3>Ảnh</h3>
        <a href="#">Xem tất cả ảnh</a>
        <div className="photos-grid">
          {
            posts.map((post) => {
              return <div>
                {post.images.map((img) => (
                  <img src={img.url}/>
                ))}
              </div>
            })
          }
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Bạn bè</h3>
        <p>{loading ? "..." : user?.friends.length || "Friend"} Người bạn</p>
        <a href="#">Xem tất cả bạn bè</a>
      </div>
    </div>
  );
};

export default ProfileSidebar;
