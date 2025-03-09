import React, { useState, useEffect } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Post.module.scss";

const cx = classNames.bind(styles);

const Post = ({ userId, id, photoURL, image, likes, comments, username, time, message, onUpdate, onDelete, currentUserId }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likesList, setLikesList] = useState(likes || []);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Kiểm tra nếu user hiện tại đã like bài viết hay chưa
    setLiked(likesList.includes(currentUserId));
  }, [likesList, currentUserId]);

  const handleOpenComments = (id) => {
    navigate(`/post/${id}/comments`);
  };

  const handleProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${format(date, "dd/MM/yyyy")} (${formatDistanceToNow(date, { addSuffix: true })})`;
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/api/posts/${id}/like`, {}, { withCredentials: true });

      if (response.data.success) {
        let updatedLikes;
        if (liked) {
          // Nếu đã like, bỏ userId khỏi danh sách likes
          updatedLikes = likesList.filter((likeId) => likeId !== currentUserId);
        } else {
          // Nếu chưa like, thêm userId vào danh sách likes
          updatedLikes = [...likesList, currentUserId];
        }

        setLikesList(updatedLikes);
        setLiked(!liked);
      } else {
        toast.error(response.data.message || "Thích bài viết thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thích bài viết!");
    }
  };

  // Hiển thị số lượt thích theo kiểu Facebook
  const renderLikesText = () => {
    if (likesList.length === 0) return "Chưa có lượt thích";
    if (liked) {
      if (likesList.length === 1) return "Bạn đã thích bài viết này";
      return `Bạn và ${likesList.length - 1} người khác đã thích`;
    }
    return `${likesList.length} lượt thích`;
  };

  return (
    <div className={cx("post")}>
      {/* Header */}
      <div className={cx("postHeader")}>
        <img onClick={() => handleProfile(userId)} src={photoURL} alt="avatar" className={cx("avatar")} />
        <div className={cx("userInfo")}>
          <h4>{username}</h4>
          <p className={cx("postTime")}>{formatDate(time)}</p>
        </div>
        <IconButton onClick={handleMenuOpen} className={cx("moreButton")}>
          <MoreHorizIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} className={cx("dropMenu")}>
          <MenuItem onClick={() => setEditing(true)} className={cx("menuItem")}>
            ✏️ Sửa
          </MenuItem>
          <MenuItem onClick={() => onDelete(id)} className={cx("menuItem", "deleteItem")}>
            ❌ Xóa
          </MenuItem>
        </Menu>
      </div>

      {/* Nội dung bài viết */}
      <div className={cx("postContent")}>
        {editing ? <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows="3" className={cx("editTextarea")} /> : <p>{message}</p>}
      </div>

      {/* Ảnh đính kèm */}
      {image && (
        <div className={cx("postImage")}>
          <img src={image} alt="Post" />
        </div>
      )}

      {/* Thống kê cảm xúc */}
      <div className={cx("postActions")}>
        <div className={cx("reactionCount")}>
          <span role="img" aria-label="like">👍</span>
          <span className={cx("likes")}>{renderLikesText()}</span>
        </div>
      </div>

      {/* Nút tương tác */}
      <div className={cx("postButtons")}>
        <button className={cx("btn", { liked })} onClick={handleLike}>
          <ThumbUpIcon /> {liked ? "Đã thích" : "Thích"}
        </button>
        <button className={cx("btn")} onClick={() => handleOpenComments(id)}>
          💬 Bình luận
        </button>
        <button className={cx("btn")}>🔗 Chia sẻ</button>
      </div>
    </div>
  );
};

export default Post;
