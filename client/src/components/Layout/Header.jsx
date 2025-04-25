import React, { useEffect, useState } from "react";
import styles from "./Header.scss"; // Chuyển sang CSS Module
import classNames from "classnames/bind";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Badge } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { formatDistanceToNow } from "date-fns";
import { GroupAddOutlined } from "@mui/icons-material";

const cx = classNames.bind(styles);
const socket = io("http://localhost:8080", { withCredentials: true, transports: ["websocket"] });

function Header() {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("");
    const [posts, setPosts] = useState([]);
    const [notifications, setNotifications] = useState([]); // Lưu danh sách thông báo
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy thông tin user hiện tại
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
                if (response.data.success) {
                    setUser(response.data.data);
                    setUserId(response.data.data._id);
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Lấy bài viết của user hiện tại
    useEffect(() => {
        if (!userId) return;
      
        const fetchUserPosts = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
            if (response.data.success) 
                setPosts(response.data.data);
          } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error);
          }
        };
      
        fetchUserPosts();
      
        if (socket && userId) {
            socket.emit("joinUser", userId);
            console.log("🔗 Joined room with ID:", userId);
          }
      
        socket.on("newPost", (newPost) => {
          console.log("Received newPost:", newPost);
          setPosts((prevPosts) => [newPost, ...prevPosts]);
        });

      
        socket.on("notification", (notification) => {
          console.log("Received notification:", notification);
          setNotifications((prev) => [
            { message: notification.message, postId: notification.postId, createdAt: notification.createdAt, type: "newPost" },
            ...prev,
          ]);
          toast.info(notification.message, { onClick: () => window.location.href = `/post/${notification.postId}` });
        });
      
        socket.on("newComment", ({ postId, commenter, commentText }) => {
          console.log("Received newComment:", { postId, commenter, commentText });
          setNotifications((prev) => [
            {
              message: `${commenter.firstName} ${commenter.lastName} đã bình luận bài viết của bạn: "${commentText}"`,
              postId,
              createdAt: new Date(),
              type: "comment",
              user: commenter,
            },
            ...prev,
          ]);
        });
        

          
        socket.on("likeNoti", ({ message, postId, createdAt }) => {
            console.log("✅ Received notification:", { message, postId, createdAt });
          
            setNotifications((prev) => [
              {
                message,
                postId,
                createdAt,
                type: "updateLikes", // hoặc 'post' nếu muốn phân loại
              },
              ...prev,
            ]);
          });
          
      
        return () => {
          socket.off("newPost");
          socket.off("notification");
          socket.off("newComment");
          socket.off("likeNoti");
        };
      }, [socket, userId]);

      

    // Tìm kiếm bạn bè khi nhập
    useEffect(() => {
        if (searchText.trim() !== "") {
            const fetchFriends = async () => {
                try {
                    const res = await axios.get(`http://localhost:8080/api/search-friends?query=${searchText}&userId=${userId}`);
                    setSuggestedFriends(res.data.data);
                } catch (err) {
                    console.error("Lỗi tìm kiếm bạn bè:", err);
                }
            };
            fetchFriends();
        } else {
            setSuggestedFriends([]);
        }
    }, [searchText, userId]);

    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/logout", { withCredentials: true });
            if (response.data.success) {
                toast.success("Đăng xuất thành công");
                navigate("/login");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchText.trim() !== "") {
            navigate(`/search?query=${searchText}`);
            setSearchText("");
            setSuggestedFriends([]);
        }
    };


    const handleUserClick = (id) => {
        setSearchText("");
        setSuggestedFriends([]);
        navigate(`/profile/${id}`);
    };

    return (
        <div className={cx("header")}>
            <div className={cx("headerLeft")}>
                <Link to="/" className={cx("headerLogo")}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/vi/thumb/d/df/Lamborghini_Logo.svg/1792px-Lamborghini_Logo.svg.png"
                        alt="Logo"
                    />
                </Link>
                <div className={cx("headerSearch")} onBlur={() => setTimeout(() => setSuggestedFriends([]), 300)}>
                    <SearchIcon className={cx({ "icon-active": location.pathname === "/search" })} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bạn bè..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearch}
                        onFocus={() => setSuggestedFriends([])}
                    />
                    {suggestedFriends.length > 0 && (
                        <Paper className={cx("searchResults")}>
                            <List>
                                {suggestedFriends.map((friend) => (
                                    <ListItem key={friend._id} button onMouseDown={() => handleUserClick(friend._id)}>
                                        <ListItemAvatar>
                                            <Avatar src={friend.avatarImage[0].url || "/default-avatar.png"} />
                                        </ListItemAvatar>
                                        <ListItemText primary={`${friend.firstName} ${friend.lastName}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </div>
            </div>

            <div className={cx("headerMid")}>
                <Link to="/" className={cx("headerOptions", { active: location.pathname === "/" })}>
                    <HomeIcon fontSize="large" className={cx({ "icon-active": location.pathname === "/" })} />
                </Link>
                <Link to="/groups" className={cx("headerOptions", { active: location.pathname === "/groups" })}>
                    <GroupAddOutlined fontSize="large" className={cx({ "icon-active": location.pathname === "/groups" })} />
                </Link>
                <Link to="/Friend" className={cx("headerOptions", { active: location.pathname === "/Friend" })}>
                    <PeopleIcon fontSize="large" className={cx({ "icon-active": location.pathname === "/Friend" })} />
                </Link>
            </div>

            <div className={cx("headerRight")}>
                <Link to={userId ? `/profile/${userId}` : "/login"} className={cx("headerInfo")}>
                    <Avatar src={loading ? "" : user?.avatarImage?.[0]?.url || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"} className={cx("avatar")} />
                    <h5>{loading ? "Loading..." : user ? user.lastName : "Guest"}</h5>
                </Link>

                <IconButton className={cx("chat")}>
                    <Link to="/chat" className={cx("chatIcon")}>
                        <ChatIcon />
                    </Link>
                </IconButton>

                <div className="dropdown-container">
                    <div className="dropdown notifications">
                        <IconButton onClick={() => setNotiDropdownOpen(!notiDropdownOpen)}>
                            <Badge badgeContent={notifications.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        {notiDropdownOpen && (
                            <Paper className="dropdown-menu">
                                <div className="dropdown-header">
                                    <h4>Thông báo</h4>
                                </div>

                                {notifications.length === 0 ? (
                                    <div className="no-notifications">Không có thông báo</div>
                                ) : (
                                    <List className="notification-list">
                                        {notifications.map((noti, index) => (
                                            <ListItem
                                                key={index}
                                                button
                                                className="notification-item"
                                                onClick={() => {
                                                    if (noti.postId) navigate(`/post/${noti.postId}`);
                                                    setNotiDropdownOpen(false);
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar src={noti.user?.avatarImage[0].url || "/default-avatar.png"} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={noti.message}
                                                    secondary={formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true })}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}

                                {notifications.length > 0 && (
                                    <div className="view-all">
                                        <Link to="/notifications">Xem tất cả thông báo</Link>
                                    </div>
                                )}
                            </Paper>
                        )}
                    </div>

                    <div className="dropdown profile">
                        <IconButton onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                            <ArrowDropDownIcon />
                        </IconButton>
                        {profileDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to={`/profile/${userId}`}><i className="fa-solid fa-user"></i> Trang cá nhân</Link>
                                {!user && <Link to="/login"><i className="fa-solid fa-user-plus"></i> Đăng nhập</Link>}
                                <Link to="/password"><i className="fa-solid fa-gear"></i> Cài đặt</Link>
                                {user && (
                                    <a onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
