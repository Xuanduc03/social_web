import React, { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import axios from "axios";
import io from "socket.io-client";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import { Avatar, IconButton, Menu, MenuItem, Modal } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Post.module.scss";

const cx = classNames.bind(styles);
const socket = io("http://localhost:8080", { withCredentials: true, transports: ["websocket"], });

const Post = React.forwardRef(
  (
    { userId, id, checkLiked, photoURL, images, likes, comments, username, time, message, onUpdate, onDelete, sharedPost, countShare },
    ref
  ) => {
    const navigate = useNavigate();
    const [like, setLike] = useState(likes || []);
    const [liked, setLiked] = useState(() => likes?.includes(checkLiked) || false);
    const [commented, setCommented] = useState(() => comments?.includes(checkLiked) || false);
    const [comment, setComment] = useState(comments || []);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(message);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openShare, setOpenShare] = useState(false);
    const [shareContent, setShareContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [sharedPostData, setSharedPostData] = useState(null);
    const [loadingSharedPost, setLoadingSharedPost] = useState(true);

    const handleOpenComments = (id) => {
      navigate(`/post/${id}/comments`);
    };
    const handleProfile = (id) => {
      navigate(`/profile/${id}`);
    }

    // Lắng nghe sự kiện cập nhật số lượt thích
    useEffect(() => {
      socket.on(`updateLikes:${id}`, ({ likes }) => {
        setLike(likes);
        setLiked(likes.includes(checkLiked));
      });

      socket.on(`updateComments:${id}`, ({ comments }) => {
        setComment(comments);
        setCommented(comments.includes(checkLiked));
      });

      return () => {
        socket.off(`updateLikes:${id}`);
        socket.off(`updateComments:${id}`);
      };
    }, [id, checkLiked]);

    //fetch user
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
          setLoading(false); // Đặt loading thành false khi hoàn tất
        }
      };
      fetchUser();
    }, []);

    // fetch like
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
            socket.emit("likePost", { postId: id, userId: checkLiked })
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

    const handleShareOpen = () => {
      setOpenShare(true);
    };

    const handleShareClose = () => {
      setOpenShare(false);
    };

    // logic phan chia se
    useEffect(() => {
      // Nếu có sharedPost (tức là bài viết này là bài chia sẻ), lấy thông tin bài viết gốc
      if (sharedPost) {
        const fetchSharedPost = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/api/posts/share/${sharedPost}`, { withCredentials: true });
            if (response.data.success) {
              setSharedPostData(response.data.post);
            } else {
              console.log("Không tìm thấy bài viết gốc:", response.data.message);
            }
          } catch (error) {
            console.log("Lỗi khi lấy bài viết gốc:", error.response?.data || error.message);
          } finally {
            setLoadingSharedPost(false);
          }
        };
        fetchSharedPost();
      } else {
        setLoadingSharedPost(false);
      }
    }, [sharedPost]);

    const handleSharePost = async () => {
      if (!shareContent.trim()) {
        toast.error("Vui lòng nhập nội dung chia sẻ!");
        return;
      }

      try {
        const response = await axios.post(
          `http://localhost:8080/api/posts/${id}/share`,
          { content: shareContent },
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success("Chia sẻ bài viết thành công!");
          setOpenShare(false);
          setShareContent("");

          // Cập nhật danh sách bài viết trên UI
          onUpdate(response.data.newPost);
        } else {
          toast.error(response.data.message || "Chia sẻ thất bại!");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Lỗi khi chia sẻ bài viết!");
      }
    };


    return (
      <div className={cx("post")} ref={ref}>
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
        {images && images.length > 0 ? (
          <div className={cx("postImage", images.length > 1 ? "multiImage" : "singleImage")}>
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


        {/* Phần chia sẻ */}
        {sharedPost && (
          <div className={cx("sharedPost")}>
            {loadingSharedPost ? (
              <p>⏳ Đang tải bài viết gốc...</p>
            ) : sharedPostData ? (
              <div>
                <div className={cx("postHeader")}>
                  <Avatar src={sharedPostData.user?.avatarImage[0].url} alt="avatar" />
                  <div>
                    <h4>{sharedPostData.user?.firstName}</h4>
                    <h4>{sharedPostData.user?.lastName}</h4>
                    <p>{formatDate(sharedPostData.createdAt)}</p>
                  </div>
                </div>
                <p>{sharedPostData.content}</p>
                {sharedPostData?.images?.length > 0 && <img style={{ width: "100% " }} src={sharedPostData.images[0].url} alt="shared" />}
              </div>
            ) : (
              <p>⚠️ Bài viết gốc không tồn tại hoặc đã bị xóa.</p>
            )}
          </div>
        )}


        {/* Thống kê cảm xúc */}
        <div className={cx("postActions")}>
          <div className={cx("reactionCount")}>
            <span role="img" aria-label="like">👍</span>
            <span className={cx("likes")} onClick={handleLike}>{liked ? `Bạn và ${like.length - 1} đã thích` : `${like.length} đã thích`}</span>
          </div>
          <div className={cx("actionButtons")}>
            <span>
              <strong>{comment ? comment.length : ""}</strong> <i class="fa-solid fa-comment"></i>
            </span>
            <span><strong>{countShare ? countShare.length : ""}</strong> <i class="fa-solid fa-share"></i></span>
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
          <button className={cx("btn")} onClick={handleShareOpen} >🔗 Chia sẻ</button>
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


        <Modal open={openShare} onClose={handleShareClose}>
          <div className={cx("modalPop")}>
            <h3>Chia sẻ bài viết</h3>
            <div className={cx("user-info")}>
              <img
                src={loading ? "loading..." : (user ? user?.avatarImage[0].url : "anh")}
                alt=""
                className={cx("avatar")}
              />
              <div className={cx("user-details")}>
                <h5>{loading ? "Loading..." : (user ? user.firstName + user.lastName : "Guest")}</h5>
                <div className={cx("share-options")}>
                  <span>Bảng feed</span>
                  <span>
                    <PeopleIcon fontSize="small" /> Bạn bè
                  </span>
                </div>
              </div>
            </div>
            <textarea
              rows="3"
              placeholder="Bạn muốn chia sẻ gì về bài viết này?"
              value={shareContent}
              onChange={(e) => setShareContent(e.target.value)}
            />
            <button className={cx("postSubmit")} onClick={handleSharePost}>
              Chia sẻ
            </button>
          </div>
        </Modal>
      </div>
    );
  }
);
export default Post;