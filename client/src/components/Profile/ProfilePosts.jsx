import React from "react";
import "./ProfilePosts.scss";

const ProfilePosts = () => {
  const posts = [
    {
      id: 1,
      user: "User",
      time: "23 tháng 4, 2025",
      content: "Đây là bài viết đầu tiên trên trang cá nhân của tôi!",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlpgOzwjh3d5VTbE4aqLWMaSSCIb7Xlj3aw&s",
    },
    {
      id: 2,
      user: "User",
      time: "10 tháng 5, 2025",
      content: "Một ngày đẹp trời để học lập trình React!",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlpgOzwjh3d5VTbE4aqLWMaSSCIb7Xlj3aw&s",
    },
  ];

  return (
    <div className="profile-posts">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="post-header">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlpgOzwjh3d5VTbE4aqLWMaSSCIb7Xlj3aw&s"
              alt="avatar"
              className="avatar"
            />
            <div>
              <h4>{post.user}</h4>
              <p>{post.time}</p>
            </div>
          </div>
          <p className="post-content">{post.content}</p>
          {post.image && <img src={post.image} alt="post" className="post-image" />}
        </div>
      ))}
    </div>
  );
};

export default ProfilePosts;
