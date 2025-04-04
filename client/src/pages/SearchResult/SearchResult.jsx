import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Paper, Typography, CircularProgress } from "@mui/material";
import styles from "./SearchResults.module.scss";
const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [error, setError] = useState(null);

    // Lấy query từ URL
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query");

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) return;
            setLoading(true);
            setError(null);

            try {
                let userId = currentUserId;

                // Nếu chưa có userId, gọi API để lấy
                if (!userId) {
                    const userRes = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
                    userId = userRes.data.data._id;
                    setCurrentUserId(userId);
                }

                // Gọi API tìm kiếm
                const res = await axios.get(`http://localhost:8080/api/search-users?query=${searchQuery}&userId=${userId}`);
                setUsers(res.data.data);
            } catch (err) {
                console.error("Lỗi khi tìm kiếm:", err);
                setError("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    // Gửi lời mời kết bạn
    const handleAddFriend = async (friendId) => {
        try {
            const res = await axios.post(
                "http://localhost:8080/api/send-friend-request",
                { friendId }, // Chỉ gửi friendId
                { withCredentials: true }
            );

            setUsers(users.map(user =>
                user._id === friendId ? { ...user, status: "pending" } : user
            ));

        } catch (err) {
            console.error("Lỗi gửi kết bạn:", err);
            alert(err.response?.data?.message || "Không thể gửi lời mời kết bạn.");
        }
    };

    const handleCancelRequest = async (friendId) => {
        try {
            const res = await axios.post(
                "http://localhost:8080/api/cancel-friend-request",
                { userId: currentUserId, friendId },
                { withCredentials: true }
            );
            setUsers(users.map(user =>
                user._id === friendId ? { ...user, status: "none" } : user
            ));

        } catch (err) {
            console.error("Lỗi hủy lời mời:", err);
            alert(err.response?.data?.message || "Không thể hủy lời mời kết bạn.");
        }
    };

        // Chuyển đến trang cá nhân
        const handleGoToProfile = (userId) => {
            navigate(`/profile/${userId}`);
        };
    // Nhắn tin
    const handleMessage = (friendId) => {
        navigate(`/chat?user=${friendId}`);
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <Typography variant="h6" gutterBottom>
                {/* Kết quả tìm kiếm cho: "{searchQuery}" */}
                Mọi người
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : users.length === 0 ? (
                <Typography>Không tìm thấy người dùng nào.</Typography>
            ) : (
                <Paper sx={{ padding: 2 }}>
                    <List>
                        {users.map((user) => (
                            <ListItem key={user._id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={user.avatarImage[0].url || "/default-avatar.png"}
                                        onClick={() => handleGoToProfile(user._id)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${user.firstName} ${user.lastName}`}
                                    onClick={() => handleGoToProfile(user._id)}
                                    style={{ cursor: "pointer" }}
                                />

                                {/* Hiển thị nút tương ứng với trạng thái bạn bè */}
                                {user.status === "friend" ? (
                                    <button className={`${styles["friend-button"]} ${styles["message"]}`} onClick={() => handleMessage(user._id)}>
                                        Nhắn tin
                                    </button>
                                ) : user.status === "none" ? (
                                    <button className={`${styles["friend-button"]} ${styles["add-friend"]}`} onClick={() => handleAddFriend(user._id)}>
                                        Thêm bạn bè
                                    </button>
                                ) : user.status === "pending" ? (
                                    <button className={`${styles["friend-button"]} ${styles["cancel-request"]}`} onClick={() => handleCancelRequest(user._id)}>
                                        Hủy lời mời
                                    </button>
                                ) : null}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </div>
    );
};

export default SearchResults;
