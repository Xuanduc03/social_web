import React, { useState } from "react";
import cx from "classnames";
import "./Post.scss";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const Post = ({ photoURL, image, username, time, message }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="post">
      {/* Header */}
      <div className="post-header">
        <img src={photoURL} alt="avatar" className="avatar" />
        <div>
          <h4>{username}</h4>
          <p className="post-time">{time}</p>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <div className="post-content">
        <p>{message}</p>
      </div>

      {/* Ảnh đính kèm (nếu có) */}
      {image && (
        <div className="post-image">
          <img src={image} alt="Post" />
        </div>
      )}

      {/* Thống kê cảm xúc */}
      <div className="post-actions">
        <div className="reaction-count">
          <span role="img" aria-label="like">👍❤️😆</span> 
          <span className="likes">{liked ? "Bạn và 123 người khác" : "123 người thích"}</span>
        </div>
        <div className="action-buttons">
          <span>Bình luận</span>
          <span>Chia sẻ</span>
        </div>
      </div>

      {/* Nút tương tác */}
      <div className="post-buttons">
        <button className={cx("btn", { liked })} onClick={() => setLiked(!liked)}>
          <ThumbUpIcon /> {liked ? "Đã thích" : "Thích"}
        </button>
        <button className="btn">💬 Bình luận</button>
        <button className="btn">🔗 Chia sẻ</button>
      </div>
    </div>
  );
};

export default Post;
