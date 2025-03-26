import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import io from "socket.io-client";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Post.module.scss";

const cx = classNames.bind(styles);
const socket = io("http://localhost:8080", { withCredentials: true, transports: ["websocket"], });

const Post = ({ userId, id, checkLiked, photoURL, images, likes, comments, username, time, message, onUpdate, onDelete }) => {

  const navigate = useNavigate();
  const [like, setLike] = useState(likes || []);
  const [liked, setLiked] = useState(() => likes?.includes(checkLiked) || false);
  const [commented, setCommented] = useState(() => comments?.includes(checkLiked) || false);
  const [comment, setComment] = useState(comments || []);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenComments = (id) => {
    navigate(`/post/${id}/comments`);
  };
  const handleProfile = (id) => {
    navigate(`/profile/${id}`);
  }

  useEffect(() => {
    socket.on(`updateLikes:${id}`, ({ likes }) => {
      setLike(likes);
      setLiked(likes.includes(checkLiked));
    });

    socket.on(`updateComments:${id}`, ({comments}) => {
      setComment(comments);
      setCommented(comments.includes(checkLiked));
    });

    return () => {
      socket.off(`updateLikes:${id}`);
      socket.off(`updateComments:${id}`);
    };
  }, [id, checkLiked]);

  useEffect(() => {
    const fetchInitialLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}/likes`, {
          withCredentials: true,
        });
        if (response.data.success) {
          const updatedLikes = response.data.likes || [];
          setLike(updatedLikes);
          setLiked(updatedLikes.includes(checkLiked));
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu lượt thích:", error);
      }
    };
  
    fetchInitialLikes();
  }, [id, checkLiked]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${format(date, 'dd/MM/yyyy')} (${formatDistanceToNow(date, { addSuffix: true })})`
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
        if (liked) {
          socket.emit("likePost", {postId: id, userId: checkLiked})
          toast.success(liked ? "Đã bỏ thích bài viết" : "Đã thích bài viết");
        } else {
          toast.success("Đã thích bài viết");
        }
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
      {/* Ảnh của bài viết  */}
      {images && images.length > 0 ?(
        <div className={cx("postImage" , images.length > 1 ? "multiImage" : "singleImage")}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Post image ${index}`}
              className={cx("image")}
            />
          ))}
        </div>
      ) : null}
      {/* Thống kê cảm xúc */}
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