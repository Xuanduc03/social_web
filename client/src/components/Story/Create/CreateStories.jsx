import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { Settings } from "@mui/icons-material";
import styles from "./CreateStories.module.scss";
import axios from "axios";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

function CreateStories() {
    const [storyType, setStoryType] = useState(null);
    const [title, setTitle] = useState("");
    const [media, setMedia] = useState(null); // { url, type }
    const [mediaFile, setMediaFile] = useState(null);
    const [bgColor, setBgColor] = useState("#ff5733");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
                if (response.data.success) setUser(response.data.data);
            } catch (error) {
                console.error("Lỗi lấy thông tin user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
       
        if (file) {
            const mediaUrl = URL.createObjectURL(file);
            setMedia({ url: mediaUrl, type: file.type });
            setMediaFile(file);
            console.log("File được chọn:", mediaUrl);
        }
    };

    const handleSubmit = async () => {
        if (!storyType) return toast.error("Vui lòng chọn loại tin!");
        if (!title.trim()) return toast.error("Vui lòng nhập tiêu đề!");
        if (storyType === "image" && !mediaFile) return toast.error("Vui lòng chọn ảnh hoặc video!");

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("type", storyType);
        formData.append("title", title);
        formData.append("bgColor", bgColor);
        if (storyType === "image" && mediaFile) {
            formData.append("media", mediaFile);
        }
        console.log("Dữ liệu gửi đi:", {
            type: storyType,
            title,
            bgColor,
            mediaFile: mediaFile ? mediaFile.name : "Không có file",
        });

          
        try {
            const response = await axios.post("http://localhost:8080/api/stories", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (response.data.success) {
                toast("Đăng tin thành công!");
                navigate("/");
            }
        } catch (error) {
            console.error("Lỗi khi đăng tin:", error);
            toast.error(error.response?.data?.message || "Đăng tin thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setStoryType(null);
        setMedia(null);
        setMediaFile(null);
        setBgColor("#b0877d");
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftColumn}>
                <div className={styles.header}>
                    <h2>Tin của bạn</h2>
                    <Settings className={styles.settingsIcon} />
                </div>
                <div className={styles.userInfo}>
                    <Avatar src={loading ? "" : user?.avatarImage[0].url || "/default-avatar.png"} />
                    <h5>{loading ? "Loading..." : user ? `${user.firstName} ${user.lastName}` : "Guest"}</h5>
                </div>

                {storyType && (
                    <input
                        type="text"
                        placeholder="Nhập tiêu đề..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.inputField}
                    />
                )}

                {storyType === "image" && (
                    <>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            id="file-upload"
                            style={{ display: "none" }}
                            onChange={handleMediaChange}
                        />
                        <label htmlFor="file-upload">
                            <Button variant="contained" component="span">
                                Chọn ảnh hoặc video
                            </Button>
                        </label>
                    </>
                )}

                {storyType === "text" && (
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                )}

                {storyType && (
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.postButton}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang đăng..." : "Đăng Story"}
                        </button>
                        <button className={styles.cancelButton} onClick={handleCancel}>Hủy</button>
                    </div>
                )}
            </div>

            <div className={styles.rightColumn}>
                {!storyType ? (
                    <div className={styles.optionContainer}>
                        <h2>Tạo tin</h2>
                        <button onClick={() => setStoryType("image")}>Tin Hình Ảnh</button>
                        <button onClick={() => setStoryType("text")}>Tin Văn Bản</button>
                    </div>
                ) : (
                    <div className={styles.previewContainer}>
                        <h2>Xem trước</h2>
                        {storyType === "image" && media && (
                            <div className={styles.imagePreview}>
                                {media.type.startsWith("video") ? (
                                    <video src={media.url} controls className={styles.preview} />
                                ) : (
                                    <img src={media.url} alt="Story Preview" className={styles.preview} />
                                )}
                                <h3>{title}</h3>
                            </div>
                        )}
                        {storyType === "text" && (
                            <div className={styles.textPreview} style={{ backgroundColor: bgColor }}>
                                <h3>{title}</h3>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateStories;