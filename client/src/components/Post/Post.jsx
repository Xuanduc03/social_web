import React, { useState } from "react";
import cx from "classnames";
import "./Post.scss";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import axios from "axios";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useNavigate } from "react-router-dom";

const Post = ({ id, photoURL, image, comments = [], username, time, message, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenComments = (id) => {
    navigate(`/post/${id}/comments`); // Chuyển hướng tới route chi tiết bình luận
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${id}/like`,
        { content: editContent },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Cập nhật bài viết thành công!");
        onUpdate({ ...response.data.data, _id: id });
        setEditing(false);
      } else {
        toast.error(response.data.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật bài viết!");
    }
    handleMenuClose();
  }

  const handleEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${id}`,
        { content: editContent },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Cập nhật bài viết thành công!");
        onUpdate({ ...response.data.data, _id: id });
        setEditing(false);
      } else {
        toast.error(response.data.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật bài viết!");
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/posts/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          toast.success("Xóa bài viết thành công!");
          onDelete(id); // Xóa khỏi danh sách
        } else {
          toast.error(response.data.message || "Xóa thất bại!");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa bài viết!");
      }
    }
    handleMenuClose(); // Đóng menu sau khi xóa
  };


  return (
    <div className="post">
      <div className="post-header">
        <img src={photoURL || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="avatar" className="avatar" />
        <div>
          <h4>{username}</h4>
          <p className="post-time">{time}</p>
        </div>
        <IconButton onClick={handleMenuOpen} style={{ marginLeft: "auto" }}>
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => { setEditing(true); handleMenuClose(); }}>Sửa</MenuItem>
          <MenuItem onClick={handleDelete}>Xóa</MenuItem>
        </Menu>
      </div>

      <div className="post-content">
        {editing ? (
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows="3" />
        ) : (
          <p>{message}</p>
        )}
      </div>

      {image && (
        <div className="post-image">
          <img src={image} alt="Post" />
        </div>
      )}

      <div className="post-actions">
        <div className="reaction-count">
          <span role="img" aria-label="like">👍❤️😆</span>
          <span className="likes">{liked ? "Bạn và 123 người khác" : "123 người thích"}</span>
        </div>
        <div className="action-buttons">
          <span><strong>{comments.length}</strong> Bình luận</span>
          <span>Chia sẻ</span>
        </div>
      </div>

      <div className="post-buttons">
        <button className={cx("btn", { liked })} onClick={() => setLiked(!liked)}>
          <ThumbUpIcon /> {liked ? "Đã thích" : "Thích"}
        </button>
        <button className="btn" onClick={() => handleOpenComments(id)} key={id}>💬 Bình luận</button>
        <button className="btn">🔗 Chia sẻ</button>
        {editing && (
          <div style={{ marginTop: "10px" }}>
            <button className="btn" onClick={handleEdit}>Lưu</button>
            <button className="btn" onClick={() => setEditing(false)}>Hủy</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;