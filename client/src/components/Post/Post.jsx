import React, { useState } from "react";
import cx from "classnames";
import "./Post.scss";

const Post = ({photoURL, image, username, time, message }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className={cx("post")}>
      <div className={cx("post-header")}>
        <img
          src={photoURL}
          alt="avatar"
          className={cx("avatar")}
        />
        <div>
          <h4>{username}</h4>
          <p>{time}</p>
        </div>
      </div>

      <div className={cx("post-content")}>
        <p>
          {message}
        </p>
      </div>

      {image && (
        <div className={cx("post-image")}>
          <img src={image} alt="Post" />
        </div>
      )}
      
      <div className={cx("post-actions")}>
        <div>
          <span role="img" aria-label="like">👍❤️😆</span> 
          <span className={cx("likes")}>.....</span>
        </div>
        <div className={cx("action-buttons")}>
          <span>Bình luận</span>
          <span>Chia sẻ</span>
        </div>
      </div>

      <div className={cx("post-buttons")}>
        <button 
          className={cx("btn", { liked: liked })} 
          onClick={() => setLiked(!liked)}
        >
          👍 {liked ? "Đã thích" : "Thích"}
        </button>
        <button className={cx("btn")}>💬 Bình luận</button>
        <button className={cx("btn")}>🔗 Chia sẻ</button>
      </div>
    </div>
  );
};

export default Post;