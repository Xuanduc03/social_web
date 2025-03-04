import React, { useEffect, useState } from 'react';
import "./Header.scss";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Header() {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
                if (response.data.success) {
                    setUser(response.data.data);
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
                window.location.reload();
            }else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    }
    return (
        <div className="header">
            <div className="headerLeft">
                <Link to={'/'} className="headerLogo">
                    <img src="https://upload.wikimedia.org/wikipedia/vi/thumb/d/df/Lamborghini_Logo.svg/1792px-Lamborghini_Logo.svg.png" alt="" />
                </Link>
                <div className="headerSearch">
                    <SearchIcon />
                    <input type="text" placeholder="Search" />
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
                <Link to={`/profile`} className="headerInfo">
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
                            <Link to="/profile"><i class="fa-solid fa-user"></i> Trang cá nhân</Link>
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