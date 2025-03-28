import React, { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar, IconButton, Menu, MenuItem, TextareaAutosize } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Post.module.scss"; // Tái sử dụng SCSS từ Post

const cx = classNames.bind(styles);

const GroupPost = ({
  userId, 
  id, 
  checkLiked,
  photoURL,
  images,
  likes = [], 
  comment = [], 
  username,
  time,
  message,
  onUpdate, 
  onDelete, 
  isMember, 
}) => {
  const navigate = useNavigate();
  const [like, setLike] = useState(likes || []);
  const [liked, setLiked] = useState(() => (likes || []).includes(checkLiked));
  const [anchorEl, setAnchorEl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message);

  const handleOpenComment = () => navigate(`/group/post/${id}/comment`);
  const handleProfile = () => navigate(`/profile/${userId}`);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Xử lý thích/bỏ thích bài viết
  const handleLike = async () => {
    if (!isMember) {
      toast.error("Chỉ thành viên nhóm mới có thể thích bài viết!");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts/${id}/like`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        const updatedLikes = response.data.likes || [];
        setLike(updatedLikes);
        setLiked(updatedLikes.includes(checkLiked));
        toast.success(liked ? "Đã bỏ thích bài viết" : "Đã thích bài viết");
      } else {
        toast.error(response.data.message || "Lỗi khi thích bài viết!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thích bài viết!");
    }
  };

  // Bắt đầu chỉnh sửa bài viết
  const handleStartEdit = () => {
    if (userId !== checkLiked) {
      toast.error("Bạn chỉ có thể sửa bài viết của chính mình!");
      return;
    }
    setEditing(true);
    handleMenuClose();
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditing(false);
    setEditContent(message); // Reset về nội dung ban đầu
  };

  // Lưu bài viết đã chỉnh sửa
  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.error("Nội dung bài viết không được để trống!");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${id}`,
        { content: editContent },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Cập nhật bài viết thành công!");
        setEditing(false);
        onUpdate({ ...response.data.data, user: { _id: userId, firstName: username.split(" ")[0], lastName: username.split(" ")[1], avatarImage: photoURL } });
      } else {
        toast.error(response.data.message || "Lỗi khi cập nhật bài viết!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật bài viết!");
    }
  };

  // Xóa bài viết
  const handleDelete = async () => {
    if (userId !== checkLiked) {
      toast.error("Bạn chỉ có thể xóa bài viết của chính mình!");
      return;
    }
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
          {userId === checkLiked && (
            <>
              <MenuItem onClick={handleStartEdit}>Sửa</MenuItem>
              <MenuItem onClick={handleDelete}>Xóa</MenuItem>
            </>
          )}
        </Menu>
      </div>

      <div className={cx("postContent")}>
        {editing ? (
          <TextareaAutosize
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            minRows={3}
            className={cx("editTextarea")}
            style={{ width: "100%", padding: "8px", borderRadius: "4px" }}
          />
        ) : (
          <p>{message}</p>
        )}
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
          <span className={cx("likes")} onClick={handleLike}>{liked ? `Bạn và ${like.length - 1} đã thích` : `${like.length} đã thích`}</span>
        </div>
        <div className={cx("actionButtons")}>
          <span>
            <strong>{comment ? comment.length : 0}</strong> Bình luận
          </span>
          <span>Chia sẻ</span>
        </div>
      </div>

      <div className={cx("postButtons")}>
        <button className={cx("btn", { liked })} onClick={handleLike} disabled={!isMember}>
          <ThumbUpIcon /> {liked ? "Đã thích" : "Thích"}
        </button>
        <button className={cx("btn")} onClick={handleOpenComment} disabled={!isMember}>
          💬 Bình luận
        </button>
        {editing && (
          <div className={cx("editActions")}>
            <button className={cx("btn", "saveBtn")} onClick={handleSaveEdit}>
              Lưu
            </button>
            <button className={cx("btn", "cancelBtn")} onClick={handleCancelEdit}>
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPost;