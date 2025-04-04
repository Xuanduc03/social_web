import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ViewStories.module.scss";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

function ViewStories() {
    const navigate = useNavigate();
    const [myStories, setMyStories] = useState([]);
    const [friendStories, setFriendStories] = useState([]);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const token = localStorage.getItem("token");

    const timeAgo = (timestamp) => {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: vi });
    };

    // Nhóm stories theo user
    const groupStoriesByUser = (stories) => {
        const groupedStories = {};
        stories.forEach(story => {
            const userId = story.user._id;
            if (!groupedStories[userId]) {
                groupedStories[userId] = {
                    user: story.user,
                    stories: []
                };
            }
            groupedStories[userId].stories.push(story);
        });
        return Object.values(groupedStories);
    };

    // Fetch stories từ API
    useEffect(() => {
        const fetchStories = async () => {
            try {

                const myStoriesRes = await axios.get("http://localhost:8080/api/stories/me", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                const friendStoriesRes = await axios.get("http://localhost:8080/api/stories/friends", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                setMyStories(groupStoriesByUser(myStoriesRes.data.data));
                setFriendStories(groupStoriesByUser(friendStoriesRes.data.data));
            } catch (error) {
                console.error("Lỗi lấy stories:", error);
            }
        };

        fetchStories();
    }, []);

    // Gộp stories của bạn và bạn bè
    const allStories = [...myStories, ...friendStories];
    const currentUser = allStories[currentUserIndex];

    // Tự động chuyển story sau 5 giây
    useEffect(() => {
        if (isPaused || !currentUser || currentUser.stories.length === 0) return;
        const timer = setTimeout(() => nextStory(), 5000);
        return () => clearTimeout(timer);
    }, [currentStoryIndex, currentUserIndex, isPaused, currentUser]);

    // Chuyển story trong cùng một user
    const nextStory = () => {
        if (!currentUser) return;
        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else {
            setCurrentUserIndex((prev) => (prev + 1) % allStories.length);
            setCurrentStoryIndex(0);
        }
    };


    // Hàm xóa tin
    const deleteStory = async (storyId) => {
        try {

            await axios.delete(`http://localhost:8080/api/stories/${storyId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            // Cập nhật danh sách stories sau khi xóa
            setMyStories((prevStories) => {
                return prevStories.map(group => ({
                    ...group,
                    stories: group.stories.filter(story => story._id !== storyId),
                })).filter(group => group.stories.length > 0);
            });

            console.log("Xóa tin thành công");
        } catch (error) {
            console.error("Lỗi xóa tin:", error);
        }
    };

    // Chuyển về story trước
    const prevStory = () => {
        if (!currentUser) return;

        if (currentStoryIndex <= 0) {
            return;
        }
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        } else {
            setCurrentUserIndex((prev) => (prev === 0 ? allStories.length - 1 : prev - 1));
            setCurrentStoryIndex(allStories[currentUserIndex - 1].stories.length - 1);
        }
    };

    return (
        <div className={styles.storyContainer}>
            {/* Cột trái - Danh sách người đăng story */}
            <div className={styles.leftColumn}>
                <h3>Tin của bạn</h3>
                {myStories.map((group, index) => (
                    <div
                        key={group.user._id}
                        className={`${styles.userItem} ${currentUserIndex === index ? styles.activeUser : ""}`}
                        onClick={() => { setCurrentUserIndex(index); setCurrentStoryIndex(0); }}
                    >
                        <img src={group.user.avatarImage[0].url || "/default-avatar.jpg"} alt="avatar" className={styles.avatar} />
                        <p>Bạn</p>
                    </div>
                ))}

                <h3>Tin bạn bè</h3>
                {friendStories.map((group, index) => (
                    <div
                        key={group.user._id}
                        className={`${styles.userItem} ${currentUserIndex === index + myStories.length ? styles.activeUser : ""}`}
                        onClick={() => { setCurrentUserIndex(index + myStories.length); setCurrentStoryIndex(0); }}
                    >
                        <img src={group.user.avatarImage[0].url || "/default-avatar.jpg"} alt="avatar" className={styles.avatar} />
                        <p>{group.user.firstName} {group.user.lastName}</p>
                    </div>
                ))}
            </div>
            {/* Cột phải - Hiển thị story */}
            <div className={styles.rightColumn}>
                {currentUser && currentUser.stories.length > 0 && (
                    <div className={styles.storyContent}>
                        {currentUser.stories[currentStoryIndex].type === "image" ? (
                            <img src={`http://localhost:8080${currentUser.stories[currentStoryIndex].imageUrl}`} alt="story" className={styles.imageStory} />
                        ) : (
                            <div className={styles.textStory} style={{ backgroundColor: currentUser.stories[currentStoryIndex].bgColor }}>
                                <p className={styles.textCenter}>{currentUser.stories[currentStoryIndex].title}</p>
                            </div>
                        )}

                        <div className={styles.overlay}>
                            <img src={currentUser.user.avatarImage[0].url || "/default-avatar.jpg"} style={{ width: "80px", height: "80px", objectFit: "contain" }} alt="avatar" className={styles.avatarLarge} />
                            <h4>{currentUser.user.firstName} {currentUser.user.lastName}</h4>
                            {currentUser.stories[currentStoryIndex].type === "image" && (
                                <p className={styles.imageTitle}>{currentUser.stories[currentStoryIndex].title}</p>
                            )}
                            <p className={styles.timeAgo}>{timeAgo(currentUser.stories[currentStoryIndex].createdAt)}</p>

                            {/* Nút xóa tin */}
                            <button className={styles.deleteBtn} onClick={() => deleteStory(currentUser.stories[currentStoryIndex]._id)}>
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>

                        {/* Nút điều hướng */}
                        <button className={styles.prevBtn} onClick={prevStory}>❮</button>
                        <button className={styles.nextBtn} onClick={nextStory}>❯</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewStories;
