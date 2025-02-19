import React from 'react'
import "./Header.scss"
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function Header() {
  return (
    <div className="header">
        <div className="headerLeft">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/768px-Facebook_Logo_%282019%29.png" alt="" />
            <div className="headerSearch">
                <SearchIcon/>
                <input type="text" placeholder="Search"/>
            </div>
        </div>

        <div className="headerMid">
            <div className="headerOptions
            headerOptions-active">
                <HomeIcon fontSize="large"/>
            </div>
            <div className="headerOptions">
                <PeopleIcon fontSize="large"/>
            </div>
        </div>

        <div className="headerRight">
            <div className="headerInfo">
                <Avatar/>
                <h5>User</h5>
            </div>
                <IconButton>
                    <ChatIcon/>
                </IconButton>
                <IconButton>
                    <NotificationsIcon/>
                </IconButton>
                <IconButton>
                    <ArrowDropDownIcon/>
                </IconButton>
        </div>
    </div>
  )
}

export default Header