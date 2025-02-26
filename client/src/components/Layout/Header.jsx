import React, { useState } from 'react';
import "./Header.scss";
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from 'react-router-dom';

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="header">
            <div className="headerLeft">
                <Link to={'/'} className="headerLogo">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png" alt="" />
                </Link>
                <div className="headerSearch">
                    <SearchIcon />
                    <input type="text" placeholder="Search" />
                </div>
            </div>

            <div className="headerMid">
                <div className="headerOptions headerOptions-active">
                    <HomeIcon fontSize="large" />
                </div>
                <div className="headerOptions">
                    <PeopleIcon fontSize="large" />
                </div>
            </div>

            <div className="headerRight">
                <Link to={'/profile'} className="headerInfo">
                    <Avatar />
                    <h5>User</h5>
                </Link>
                <IconButton>
                    <Link to="/chat">
                        <ChatIcon />
                    </Link>
                </IconButton>
                <IconButton>
                    <NotificationsIcon />
                </IconButton>
                <div className="dropdown">
                    <IconButton onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <ArrowDropDownIcon />
                    </IconButton>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to="/profile">👤 Trang cá nhân</Link>
                            <Link to="/register">Đăng ký</Link>
                            <Link to="/settings">⚙ Cài đặt</Link>
                            <Link to="/logout">🚪 Đăng xuất</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
