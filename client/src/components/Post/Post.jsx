import React, { useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import { format ,formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Post.module.scss";

const cx = classNames.bind(styles);

const Post = ({userId, id, photoURL, image, likes, comments, username, time, message, onUpdate, onDelete }) => {

  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenComments = (id) => {
    navigate(`/post/${id}/comments`);
  };
  const handleProfile = (id) => {
    navigate(`/profile/${id}`);
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${format(date, 'dd/MM/yyyy')} (${formatDistanceToNow(date, {addSuffix: true})})`
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts/${id}/like`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setLiked(!liked);
        toast.success(liked ? "Đã bỏ thích bài viết!" : "Đã thích bài viết!");
      } else {
        toast.error(response.data.message || "Thích bài thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi thích bài viết!");
    }
  };

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
          onDelete(id);
        } else {
          toast.error(response.data.message || "Xóa thất bại!");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi xóa bài viết!");
      }
    }
    handleMenuClose();
  };


  return (
    <div className={cx("post")}>
      {/* Header */}
      <div className={cx("postHeader")}>
        <img
        onClick={() => handleProfile(userId)}
          src={photoURL || "https://via.placeholder.com/40"}
          alt="avatar"
          className={cx("avatar")}
        />
        <div className={cx("userInfo")}>
          <h4>{username}</h4>
          <p className={cx("postTime")}>{formatDate(time)}</p>
        </div>
        <IconButton
          onClick={handleMenuOpen}
          className={cx("moreButton")}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className={cx("dropMenu")}
        >
          <MenuItem
            onClick={() => {
              setEditing(true);
              handleMenuClose();
            }}
            className={cx("menuItem")}
          >
            <i class="fa-solid fa-pen"></i>
            Sửa
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            className={cx("menuItem", "deleteItem")}
          >
            <i class="fa-solid fa-circle-xmark"></i>
            Xóa
          </MenuItem>
        </Menu>
      </div>

      {/* Nội dung bài viết */}
      <div className={cx("postContent")}>
        {editing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows="3"
            className={cx("editTextarea")}
          />
        ) : (
          <p>{message}</p>
        )}
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
          <span className={cx("likes")}>{liked ? "Bạn đã thích" : likes.length}</span>
        </div>
        <div className={cx("actionButtons")}>
          <span>
            <strong>{comments ? comments.length : 0}</strong> Bình luận
          </span>
          <span>Chia sẻ</span>
        </div>
      </div>
      {/* Nút tương tác */}
      <div className={cx("postButtons")}>
        <button
          className={cx("btn", { liked })}
          onClick={handleLike}
        >
          <ThumbUpIcon /> {liked ? "Đã thích" : "Thích"}
        </button>
        <button className={cx("btn")} onClick={() => handleOpenComments(id)}>
          💬 Bình luận
        </button>
        <button className={cx("btn")}>🔗 Chia sẻ</button>
        {editing && (
          <div className={cx("editActions")}>
            <button className={cx("btn", "saveBtn")} onClick={handleEdit}>
              Lưu
            </button>
            <button className={cx("btn", "cancelBtn")} onClick={() => setEditing(false)}>
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;