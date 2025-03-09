import React, { useEffect, useState } from 'react';
import "./Header.scss";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {  List, ListItem, ListItemAvatar, ListItemText, Paper } from "@mui/material";


function Header() {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [userId , setuserId ] = useState(""); //id ngườu dùng
    const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

      useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
                if (response.data.success) {
                    setUser(response.data.data);
                    setuserId(response.data.data._id); 
                } else {
                    console.log("Không lấy được thông tin user:", response.data.message);
                }
            } catch (error) {
                console.log("Lỗi khi lấy thông tin:", error.response?.data || error.message);
            } finally {
                setLoading(false); // Đặt loading thành false khi hoàn tất
            }
        };
        fetchUser();
    }, []);



    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/logout", { withCredentials: true });
            if(response.data.success){
                toast.success("Đăng xuất thành công");
                navigate("/login")
            }else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }




    // State tìm kiếm
    const [searchText, setSearchText] = useState("");
    const [suggestedFriends, setSuggestedFriends] = useState([]);

    // Lấy thông tin user hiện tại
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
                if (response.data.success) {
                    setUser(response.data.data);
                    setuserId(response.data.data._id);
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin user:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

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

    // Xử lý khi nhấn Enter
    const handleSearch = (e) => {
        if (e.key === "Enter" && searchText.trim() !== "") {
            navigate(`/search?query=${searchText}`);
            setSearchText("");
            setSuggestedFriends([]);
        }
    };

    // Xử lý chọn người dùng từ danh sách gợi ý
    const handleUserClick = (id) => {
        setSearchText("");
        setSuggestedFriends([]);
        navigate(`/profile/${id}`);
    };



    return (
        <div className="header">
               <div className="headerLeft">
                <Link to={'/'} className="headerLogo">
                    <img src="https://upload.wikimedia.org/wikipedia/vi/thumb/d/df/Lamborghini_Logo.svg/1792px-Lamborghini_Logo.svg.png" alt="" />
                </Link>
                <div className="headerSearch" onBlur={() => setTimeout(() => setSuggestedFriends([]), 300)}>
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Tìm kiếm bạn bè..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearch}
                        onFocus={() => setSuggestedFriends([])}
                    />
                    {/* Hiển thị popup gợi ý bạn bè */}
                    {suggestedFriends.length > 0 && (
                        <Paper className="search-results">                      
                            <List>
                                {suggestedFriends.map((friend) => (
                                    <ListItem key={friend._id} button onMouseDown={() => handleUserClick(friend._id)}>
                                        <ListItemAvatar>
                                            <Avatar src={friend.avatarImage || "/default-avatar.png"} />
                                        </ListItemAvatar>
                                        <ListItemText primary={`${friend.firstName} ${friend.lastName}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    )}
                </div>
            </div>

            <div className="headerMid">
                <Link to={'/'} className="headerOptions headerOptions-active">
                    <HomeIcon fontSize="large" />
                </Link>
                <Link to={'/Friend'} className="headerOptions">
                    <PeopleIcon fontSize="large" />
                </Link>
            </div>

            <div className="headerRight">
                {/* <Link to={`/profile/${userId}`} className="headerInfo"> */}
                <Link to={userId ? `/profile/${userId}` : "/login"} className="headerInfo">
                    <img src={loading ? "loading..." : (user? user.avatarImage : "anh")} alt="" className='avatar' />
                    <h5>{loading ? "Loading..." : (user ? user.lastName : "Guest")}</h5>
                </Link>
                <IconButton className='chat'>
                    <Link to="/chat" className='chat-icon'>
                        <ChatIcon />
                    </Link>
                </IconButton>
                <div className="dropdown notifications">
                    <IconButton onClick={() => setNotiDropdownOpen(!notiDropdownOpen)}>
                        <NotificationsIcon />
                    </IconButton>
                    {notiDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="#">🔔 Tin tức mới từ bạn bè</Link>
                            <Link to="#">📩 Tin nhắn từ nhóm</Link>
                            <Link to="#">🎉 Sự kiện sắp tới</Link>
                            <Link to="#">Xem tất cả thông báo</Link>
                        </div>
                    )}
                </div>
                <div className="dropdown profile">
                    <IconButton onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                        <ArrowDropDownIcon />
                    </IconButton>
                    {profileDropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to={`/profile/${userId._id}`}><i class="fa-solid fa-user"></i> Trang cá nhân</Link>
                            {!user && <Link to="/login"><i class="fa-solid fa-user-plus"></i> Đăng nhập</Link>}
                            
                            <Link to="/settings"><i class="fa-solid fa-gear"></i> Cài đặt</Link>
                            {user && (
                                <a onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Đăng xuất</a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;



// import React, { useEffect, useState } from 'react';
// import "./Header.scss";
// import SearchIcon from '@mui/icons-material/Search';
// import HomeIcon from '@mui/icons-material/Home';
// import PeopleIcon from '@mui/icons-material/People';
// import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper } from "@mui/material";
// import ChatIcon from '@mui/icons-material/Chat';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function Header() {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [userId, setUserId] = useState("");
//     const [loading, setLoading] = useState(true);

//     // State tìm kiếm
//     const [searchText, setSearchText] = useState("");
//     const [suggestedFriends, setSuggestedFriends] = useState([]);

//     // Lấy thông tin user hiện tại
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
//                 if (response.data.success) {
//                     setUser(response.data.data);
//                     setUserId(response.data.data._id);
//                 }
//             } catch (error) {
//                 console.error("Lỗi lấy thông tin user:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUser();
//     }, []);

//     // Tìm kiếm bạn bè khi nhập
//     useEffect(() => {
//         if (searchText.trim() !== "") {
//             const fetchFriends = async () => {
//                 try {
//                     const res = await axios.get(`http://localhost:8080/api/search-friends?query=${searchText}&userId=${userId}`);
//                     setSuggestedFriends(res.data.data);
//                 } catch (err) {
//                     console.error("Lỗi tìm kiếm bạn bè:", err);
//                 }
//             };
//             fetchFriends();
//         } else {
//             setSuggestedFriends([]);
//         }
//     }, [searchText, userId]);

//     // Xử lý khi nhấn Enter
//     const handleSearch = (e) => {
//         if (e.key === "Enter" && searchText.trim() !== "") {
//             navigate(`/search?query=${searchText}`);
//             setSearchText("");
//             setSuggestedFriends([]);
//         }
//     };

//     // Xử lý chọn người dùng từ danh sách gợi ý
//     const handleUserClick = (id) => {
//         setSearchText("");
//         setSuggestedFriends([]);
//         navigate(`/profile/${id}`);
//     };

//     return (
//         <div className="header">
//             <div className="headerLeft">
//                 <Link to={'/'} className="headerLogo">
//                     <img src="https://upload.wikimedia.org/wikipedia/vi/thumb/d/df/Lamborghini_Logo.svg/1792px-Lamborghini_Logo.svg.png" alt="" />
//                 </Link>
//                 <div className="headerSearch" onBlur={() => setTimeout(() => setSuggestedFriends([]), 300)}>
//                     <SearchIcon />
//                     <input
//                         type="text"
//                         placeholder="Tìm kiếm bạn bè..."
//                         value={searchText}
//                         onChange={(e) => setSearchText(e.target.value)}
//                         onKeyDown={handleSearch}
//                         onFocus={() => setSuggestedFriends([])}
//                     />
//                     {/* Hiển thị popup gợi ý bạn bè */}
//                     {suggestedFriends.length > 0 && (
//                         <Paper className="search-results">                      
//                             <List>
//                                 {suggestedFriends.map((friend) => (
//                                     <ListItem key={friend._id} button onMouseDown={() => handleUserClick(friend._id)}>
//                                         <ListItemAvatar>
//                                             <Avatar src={friend.avatarImage || "/default-avatar.png"} />
//                                         </ListItemAvatar>
//                                         <ListItemText primary={`${friend.firstName} ${friend.lastName}`} />
//                                     </ListItem>
//                                 ))}
//                             </List>
//                         </Paper>
//                     )}
//                 </div>
//             </div>

//             <div className="headerMid">
//                 <Link to={'/'} className="headerOptions headerOptions-active">
//                     <HomeIcon fontSize="large" />
//                 </Link>
//                 <Link to={'/Friend'} className="headerOptions">
//                     <PeopleIcon fontSize="large" />
//                 </Link>
//             </div>

//             <div className="headerRight">
//                 <Link to={`/profile/${userId}`} className="headerInfo">
//                     <img src={loading ? "loading..." : (user ? user.avatarImage : "default-avatar.png")} alt="" className='avatar' />
//                     <h5>{loading ? "Loading..." : (user ? user.lastName : "Guest")}</h5>
//                 </Link>
//                 <IconButton className='chat'>
//                     <Link to="/chat" className='chat-icon'>
//                         <ChatIcon />
//                     </Link>
//                 </IconButton>
//                 <div className="dropdown notifications">
//                     <IconButton>
//                         <NotificationsIcon />
//                     </IconButton>
//                 </div>
//                 <div className="dropdown profile">
//                     <IconButton>
//                         <ArrowDropDownIcon />
//                     </IconButton>
//                 </div>
//             </div>
            
//         </div>
//     );
// }

// export default Header;
