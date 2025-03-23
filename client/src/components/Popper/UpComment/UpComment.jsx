import React, { useEffect, useState } from 'react';
import style from "./UpComment.module.scss";
import { TextField, Button, Avatar, Modal } from '@mui/material';
import axios from "axios";
import { toast } from "react-toastify";
import { format ,formatDistanceToNow } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

const UpComment = () => {
  const { postId } = useParams(); // Lấy postId từ URL
  const navigate = useNavigate();
  const [postData, setPostData] = useState(null); // Dữ liệu bài post
  const [commentContent, setCommentContent] = useState(""); // Nội dung bình luận mới
  const [comments, setComments] = useState([]); // Danh sách bình luận
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState("");

  // Đóng popup và quay lại trang trước
  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };

  // Lấy dữ liệu bài post khi component mounted hoặc postId thay đổi
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const responseUser = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          setPostData(response.data.data);
          setUser(responseUser.data.data);
          setComments(response.data.data.comments || []); // Load comments từ API
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu bài viết!");
        handleClose();
      }
    };
    fetchPostData();
  }, [postId]);

  // Xử lý gửi bình luận
  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/posts/${postId}/comment`,
        { text: commentContent },
        { withCredentials: true ,
          headers: { "Content-Type": "application/json" }
        }
      );
 
      if (response.data.success) {
        toast.success("Bình luận thành công!");

        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`, {
          withCredentials: true,
        });
        setComments(response.data.data.comments || []);
        setCommentContent("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi bình luận!");
    }
  };

   const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${format(date, 'dd/MM/yyyy')} (${formatDistanceToNow(date, {addSuffix: true})})`
    }
  

  // Hiển thị loading khi chưa có dữ liệu
  if (!postData) return <div>Loading...</div>;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="comment-modal-title"
    >
      <div className={style.upCommentContainer}>
        {/* Chi tiết bài post */}
        <div className={style.postDetail}>
          <div className={style.postHeader}>
            <Avatar 
              src={user.avatarImage || "https://via.placeholder.com/40"} // Dùng photoURL nếu có
              alt="avatar"
              className={style.avatar}
            />
            <div className={style.userInfo}>
              <h4 className={style.username}>{`${postData.user.firstName} ${postData.user.lastName}`}</h4>
              <p className={style.time}>{formatDate(postData.createdAt)}</p>
            </div>
          </div>
          <div className={style.postContent}>
            <p>{postData.content}</p>
            {postData.images && postData.images.length > 0 && (
              <img 
                src={postData.images[0].url} 
                alt="Post" 
                className={style.postImage}
                onError={() => console.log(`Failed to load image: ${postData.images[0].url}`)}
              />
            )}
          </div>
        </div>

        {/* Phần bình luận */}
        <div className={style.commentsSection}>
          <h3>Bình luận</h3>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className={style.comment}>
                <div className={style.commentHeader}>
                <strong>{loading ? "Loading..." : comment ? `${comment.user.firstName} ${comment.user.lastName}` : "User Name"}</strong>
                <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p className={style.noComments}>Chưa có bình luận nào.</p>
          )}

          <div className={style.commentForm}>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              variant="outlined"
              className={style.commentInput}
            />
            <Button
            type='submit'
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              className={style.submitButton}
            >
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpComment;