import React from "react";
import styles from "./Story.module.scss";
import { Avatar } from "@mui/material";

const stories = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    background: "https://source.unsplash.com/random/300x500?nature"
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
    background: "https://source.unsplash.com/random/300x500?city"
  },
  {
    id: 3,
    name: "Phạm Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
    background: "https://source.unsplash.com/random/300x500?ocean"
  },
  {
    id: 4,
    name: "Lê Thị D",
    avatar: "https://i.pravatar.cc/150?img=4",
    background: "https://source.unsplash.com/random/300x500?forest"
  },
];

function Story() {
  return (
    <div className={styles.storyReel}>
      {stories.map((story) => (
        <div
          key={story.id}
          className={styles.story}
          style={{ backgroundImage: `url(${story.background})` }}
        >
          <Avatar src={story.avatar} className={styles.avatar} />
          <h4>{story.name}</h4>
        </div>
      ))}
    </div>
  );
}

export default Story;
