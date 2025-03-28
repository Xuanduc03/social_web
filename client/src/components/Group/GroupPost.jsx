import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Post.module.scss"; // Tái sử dụng SCSS từ Post

const cx = classNames.bind(styles);

const GroupPost = ({ userId, id, checkLiked, photoURL, images, likes, comments, username, time, message, onUpdate, onDelete, isMember }) => {
  const navigate = useNavigate();
  const [like, setLike] = useState(likes || []);
  const [liked, setLiked] = useState(() => likes?.includes(checkLiked) || false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenComments = () => navigate(`/group/post/${id}/comments`);
  const handleProfile = () => navigate(`/profile/${userId}`);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLike = async () => {
    if (!isMember) {
      toast.error("Chỉ thành viên nhóm mới có thể tương tác!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts/${id}/like`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setLike(response.data.likes);
        setLiked(response.data.likes.includes(checkLiked));
        toast.success(liked ? "Đã bỏ thích bài viết" : "Đã thích bài viết");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thích bài viết!");
    }
  };

  const handleEdit = async () => {
    // Logic chỉnh sửa bài viết (tương tự Post.js, nhưng không cần chia sẻ)
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      const response = await axios.delete(`http://localhost:8080/api/posts/${id}`, { withCredentials: true });
      if (response.data.success) {
        toast.success("Xóa bài viết thành công!");
        onDelete(id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa bài viết!");
    }
    handleMenuClose();
  };

  return (
    <div className={cx("post")}>
      <div className={cx("postHeader")}>
        <img onClick={handleProfile} src={photoURL || "https://via.placeholder.com/40"} alt="avatar" className={cx("avatar")} />
        <div className={cx("userInfo")}>
          <h4>{username}</h4>
          <p className={cx("postTime")}>{new Date(time).toLocaleString()}</p>
        </div>
        <IconButton onClick={handleMenuOpen} className={cx("moreButton")}>
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>Sửa</MenuItem>
          <MenuItem onClick={handleDelete}>Xóa</MenuItem>
        </Menu>
      </div>

      <div className={cx("postContent")}>
        <p>{message}</p>
      </div>

      {images && images.length > 0 && (
        <div className={cx("postImage", images.length > 1 ? "multiImage" : "singleImage")}>
          {images.map((image, index) => (
            <img key={index} src={image.url} alt={`Post image ${index}`} className={cx("image")} />
          ))}
        </div>
      )}

      <div className={cx("postActions")}>
        <div className={cx("reactionCount")}>
          <span role="img" aria-label="like">👍</span>
          <span className={cx("likes")}>{liked ? `Bạn và ${like.length - 1} đã thích` : `${like.length} đã thích`}</span>
        </div>
        <div className={cx("actionButtons")}>
          <span><strong>{comments ? comments.length : 0}</strong> Bình luận</span>
        </div>
      </div>

      <div className={cx("postButtons")}>
        <button className={cx("btn", { liked })} onClick={handleLike}>
          <ThumbUpIcon /> {liked ? "Đã thích" : "Thích"}
        </button>
        <button className={cx("btn")} onClick={handleOpenComments}>💬 Bình luận</button>
      </div>
    </div>
  );
};

export default GroupPost;