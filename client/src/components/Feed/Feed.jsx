import React, { useEffect, useRef, useState } from 'react';
import "./Feed.scss";
import Story from "../Story/Story";
import Post from '../Post/Post';
import UpPost from '../Popper/UpPost/UpPost';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8080", { withCredentials: true, transports: ["websocket"] });

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

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
      if (response.data.success) setUser(response.data.data);
      else setError("Không lấy được thông tin user.");
    } catch (error) {
      setError("Lỗi khi lấy thông tin user. Vui lòng thử lại.");
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/posts?page=${page}&limit=5`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setPosts((prevPost) => [...prevPost, ...response.data.data]);
        setPage((prevPage) => prevPage + 1);
        setHasMore(response.data.data.length > 0);
      }
    } catch (error) {
      setError("Lỗi khi lấy bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

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

  useEffect(() => {
    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    socket.on("newLike", ({ postId, liker }) => {
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
      socket.disconnect();
    };
  }, []);

  const handleAddPost = (newPost) => setPosts([newPost, ...posts]);
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
          key={post._id}
          ref={index === posts.length - 1 ? lastPostRef : null}
          id={post._id}
          userId={post.user._id}
          photoURL={post.user?.avatarImage[0].url || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
          images={post.images || []}
          username={`${post.user?.firstName || "Guest"} ${post.user?.lastName || ""}`}
          time={post.createdAt}
          message={post.content || ""}
          likes={post.likes}
          checkLiked={loading ? "" : user?._id}
          comments={post.comments}
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