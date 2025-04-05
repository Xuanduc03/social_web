import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Story.module.scss";
import { Add, ChevronLeft, ChevronRight } from "@mui/icons-material";

function Story({ user }) {
    const router = useNavigate();
    const scrollRef = useRef(null);
    const [stories, setStories] = useState([]);

    useEffect(() => {
        if (!user) return;

        const fetchLatestStories = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/stories/latest/${user._id}`);
                setStories([
                    ...(res.data.data.myLatestStory ? [res.data.data.myLatestStory] : []),
                    ...res.data.data.friendLatestStories,
                ]);
                console.log("Latest stories:", res.data.data);
            } catch (error) {
                console.error("Lỗi khi tải stories:", error);
            }
        };

        fetchLatestStories();
    }, [user]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
        }
    };

    return (
        <div className={styles.storyContainer}>
            {/* Nút lùi */}
            <button className={styles.prevBtn} onClick={scrollLeft}>
                <ChevronLeft fontSize="large" />
            </button>

            <div className={styles.storyReel} ref={scrollRef}>
                {/* Nút tạo tin */}
                <div className={`${styles.story} ${styles.createStory}`} onClick={() => router("/stories/create")}>
                    <img src={user ? user.avatarImage[0].url : "https://sme.hust.edu.vn/wp-content/uploads/2022/02/Avatar-Facebook-trang.jpg"} alt="avatar" />
                    <p>Tạo tin</p>
                </div>

                {/* Hiển thị danh sách story */}
                {stories.map((story) => (
                    <div
                        key={story._id}
                        className={styles.story}
                        style={{
                            backgroundImage: story.type === "image" && story.media.length > 0 ? `url(${story.media[0].url})` : "none",
                            //  backgroundImage: story.type === "image" ? `url(${story.media.url})` : "none",
                            backgroundColor: story.type === "text" ? story.bgColor : "transparent",
                        }}
                        onClick={() => router(`/stories/view/${story._id}`)}
                    >
                        <Avatar src={story.user.avatarImage[0].url} className={styles.avatar} />
                        {/* <h4>{story.user.firstName + " " + story.user.lastName}</h4> */}
                        <h4>
                            {story.user._id === user._id ? "Tin của bạn" : story.user.firstName + " " + story.user.lastName}
                        </h4>
                        {/* Nếu là story văn bản, hiển thị nội dung */}
                        {story.type === "text" && <p className={styles.storyText}>{story.title}</p>}
                    </div>
                ))}
            </div>

            {/* Nút tiến */}
            <button className={styles.nextBtn} onClick={scrollRight}>
                <ChevronRight fontSize="large" />
            </button>
        </div>
    );
}

export default Story;

