import React, { useEffect, useState } from 'react';
import "./Feed.scss";
import Story from "../Story/Story";
import Post from '../Post/Post';
import UpPost from '../Popper/UpPost/UpPost';
import axios from 'axios';


function Feed() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]); // State để lưu danh sách bài viết

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
        setLoading(false);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts", { withCredentials: true });
        if (response.data.success) {
          setPosts(response.data.data); // Lấy danh sách bài viết từ server
        }
      } catch (error) {
        console.log("Lỗi khi lấy bài viết:", error.response?.data || error.message);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  // Hàm thêm bài viết mới
  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]); // Thêm bài mới vào đầu danh sách
  };

  // Hàm cập nhật bài viết
  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

  // Hàm xóa bài viết
  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <div className="feed">
      <Story />
      <UpPost onAddPost={handleAddPost} />
      {posts.map((post) => (
        <Post
          key={post._id}
          id={post._id}
          photoURL={post.user?.avatarImage || "https://via.placeholder.com/40"}
          image={post.images?.[0]?.url || ""}
          username={`${post.user?.firstName || "Guest"} ${post.user?.lastName || ""}`}
          time={new Date(post.createdAt).toLocaleTimeString()}
          message={post.content || ""}
          comments={post.comments}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
      />
      ))}
    </div>
  );
}

export default Feed;