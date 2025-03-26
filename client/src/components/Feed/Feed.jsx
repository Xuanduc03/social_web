import React, { useEffect, useState } from 'react';
import "./Feed.scss";
import Story from "../Story/Story";
import Post from '../Post/Post';
import UpPost from '../Popper/UpPost/UpPost';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8080", { withCredentials: true, transports: ["websocket"], });

function Feed() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]); 

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

    // Nhận bài viết mới
    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    // Nhận thông báo khi có like mới
    socket.on("newLike", ({ postId, liker }) => {
      console.log("Received newLike:", { postId, liker });
      setNotifications((prev) => [
          {
              message: `${liker.firstName} ${liker.lastName} đã thích bài viết của bạn`,
              postId,
              createdAt: new Date(),
              type: "like",
              user: liker,
          },
          ...prev,
      ]);
  });

    return () => {
      socket.off("newPost");
      socket.off("newLike")
    };
  }, []);



  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  };

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
          userId={post.user._id}
          photoURL={post.user?.avatarImage || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
          images={post.images || []}
          username={`${post.user?.firstName || "Guest"} ${post.user?.lastName || ""}`}
          time={post.createdAt}
          message={post.content || ""}
          likes={post.likes}
          checkLiked={loading ? "" : user._id}
          comments={post.comments}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
        />
      ))}
    </div>
  );
}

export default Feed;