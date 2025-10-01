import React, { useEffect, useRef, useState } from 'react';
import "./Feed.scss";
import Story from "../Story/Story";
import Post from '../Post/Post';
import UpPost from '../Popper/UpPost/UpPost';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_SOCKET_URL}`, { withCredentials: true, transports: ["websocket"] });

function Feed() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const observer = useRef();
  const lastPostRef = useRef(null);

  // Lấy thông tin người dùng
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}me`, { withCredentials: true });
      if (response.data.success) setUser(response.data.data);
      else setError("Không lấy được thông tin user.");
    } catch (error) {
      setError("Lỗi khi lấy thông tin user.");
    }
  };

  // Lấy danh sách bài viết
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts?page=${page}&limit=5`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setPosts((prevPosts) => {
          const newPosts = response.data.data.filter(
            (newPost) => !prevPosts.some((post) => post._id === newPost._id)
          );
          return [...prevPosts, ...newPosts];
        });
        setPage((prevPage) => prevPage + 1);
        setHasMore(response.data.data.length > 0);
      }
    } catch (error) {
      setError("Lỗi khi lấy bài viết.");
    } finally {
      setLoading(false);
    }
  };

  // Khởi tạo
  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchPosts();
      }
    });

    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [hasMore, loading]);

  // Socket.IO listener
  useEffect(() => {
    const handleNewPost = (newPost) => {
      console.log("Received newPost:", newPost);
      setPosts((prevPosts) => {
        // Ngăn trùng lặp dựa trên _id
        if (prevPosts.some((post) => post._id === newPost._id)) {
          return prevPosts;
        }
        return [newPost, ...prevPosts]; // Thêm bài mới vào đầu
      });
    };

    const handleNewLike = ({ postId, liker }) => {
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
    };

    // Gửi identify khi có user
    if (user?._id) socket.emit("identify", user._id);

    socket.on("newPost", handleNewPost);
    socket.on("newLike", handleNewLike);

    return () => {
      socket.off("newPost", handleNewPost);
      socket.off("newLike", handleNewLike);
    };
  }, [user?._id]); // Dependency là user._id để tránh lỗi kích thước thay đổi

  // Callback từ UpPost
  const handleAddPost = (newPost) => {
    setPosts((prevPosts) => {
      if (prevPosts.some((post) => post._id === newPost._id)) return prevPosts;
      return [newPost, ...prevPosts];
    });
  };

  const handleUpdatePost = (updatedPost) =>
    setPosts(posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)));
  const handleDeletePost = (postId) => setPosts(posts.filter((post) => post._id !== postId));

  return (
    <div className="feed">
      <Story user={user} />
      <UpPost onAddPost={handleAddPost} />
      {error && <div className="error">{error}</div>}
      {posts.map((post, index) => (
        <Post
          key={post._id} // Đảm bảo key là duy nhất
          ref={index === posts.length - 1 ? lastPostRef : null}
          id={post._id}
          userId={post.user._id}
          photoURL={post.user?.avatarImage?.[0]?.url || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
          images={post.images || []}
          username={`${post.user?.firstName || "Guest"} ${post.user?.lastName || ""}`}
          time={post.createdAt}
          message={post.content || ""}
          likes={post.likes || []}
          checkLiked={user?._id || ""}
          countShare={post.shares || 0}
          comments={post.comments || []}
          sharedPost={post.sharedPost}
          onUpdate={handleUpdatePost}
          onDelete={handleDeletePost}
        />
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default Feed;