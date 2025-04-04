import React, { useEffect, useState } from 'react';
import style from "./UpComment.module.scss"; // Tái sử dụng SCSS từ UpComment
import { TextField, Button, Avatar, Modal } from '@mui/material';
import axios from "axios";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

const GroupComment = ({ isMember }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const responseUser = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`, { withCredentials: true });
        if (response.data.success) {
          if (!response.data.data.group) {
            toast.error("Đây không phải bài viết trong nhóm!");
            navigate("/");
            return;
          }
          setPostData(response.data.data);
          setUser(responseUser.data.data);
          setComments(response.data.data.comments || []);
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài viết!");
        handleClose();
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId]);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  const handleAddComment = async () => {
    if (!isMember) {
      toast.error("Chỉ thành viên nhóm mới có thể bình luận!");
      return;
    }
    if (!commentContent.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts/${postId}/comment`,
        { text: commentContent },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success("Bình luận thành công!");
        setComments((prev) => [...prev, response.data.data]);
        setCommentContent("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi bình luận!");
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.text);
    setActionMenuOpen(null);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId) => {
    if (!editContent.trim()) {
      toast.error("Nội dung bình luận không được để trống!");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/posts/${postId}/comment/${commentId}`,
        { text: editContent },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success("Cập nhật bình luận thành công!");
        setComments((prev) =>
          prev.map((comment) => (comment._id === commentId ? { ...comment, text: editContent } : comment))
        );
        setEditingCommentId(null);
        setEditContent("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật bình luận!");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/posts/${postId}/comment/${commentId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Xóa bình luận thành công!");
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa bình luận!");
    }
  };

  const toggleActionMenu = (commentId) => {
    setActionMenuOpen(actionMenuOpen === commentId ? null : commentId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${format(date, 'dd/MM/yyyy')} (${formatDistanceToNow(date, { addSuffix: true })})`
  };

  if (loading || !postData) return <div>Loading...</div>;

  return (
    <Modal open={open} onClose={handleClose}>
      <div className={style.upCommentContainer}>
        <div className={style.postDetail}>
          <div className={style.postHeader}>
            <Avatar src={postData.user.avatarImage[0].url || "https://via.placeholder.com/40"} className={style.avatar} />
            <div className={style.userInfo}>
              <h4 className={style.username}>{`${postData.user.firstName} ${postData.user.lastName}`}</h4>
              <p className={style.time}>{formatDate(postData.createdAt)}</p>
            </div>
          </div>
          <div className={style.postContent}>
            <p>{postData.content}</p>
            {postData.images && postData.images.length > 0 && (
              <img src={postData.images[0].url} alt="Post" className={style.postImage} />
            )}
          </div>
        </div>

        <div className={style.commentsSection}>
          <h3>Bình luận</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className={style.comment}>
                <div className={style.commentHeader}>
                  <div>
                    <strong>{`${comment.user.firstName} ${comment.user.lastName}`}</strong>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  {comment.user._id === user._id && (
                    <div className={style.actionMenu}>
                      <button onClick={() => toggleActionMenu(comment._id)}>⋮</button>
                      {actionMenuOpen === comment._id && (
                        <div className={style.dropdownMenu}>
                          <button onClick={() => handleEditComment(comment)}>Sửa</button>
                          <button onClick={() => handleDeleteComment(comment._id)}>Xóa</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {editingCommentId === comment._id ? (
                  <textarea
                    className={style.editCommentInput}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                ) : (
                  <p>{comment.text}</p>
                )}
                {editingCommentId === comment._id && (
                  <div className={style.commentActions}>
                    <button className={style.saveButton} onClick={() => handleSaveEdit(comment._id)}>Lưu</button>
                    <button className={style.cancelButton} onClick={handleCancelEdit}>Hủy</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className={style.noComments}>Chưa có bình luận nào.</p>
          )}

          {isMember && (
            <div className={style.commentForm}>
              <Avatar src={user.avatarImage || "https://via.placeholder.com/40"} className={style.avatar} />
              <TextField
                rows={2}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                variant="outlined"
                className={style.commentInput}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
                className={style.submitButton}
              >
                Gửi
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GroupComment;