import React from 'react'
import "./Story.scss"
import { Avatar } from '@mui/material'
function Story() {
  return (
    <div className="storyReel">
        <div className="story" style={{backgroundImage:'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR132TBAD0-GhGhN8_2Xr-3obkFd4NzFbk6Hg&s)'}}>
            <Avatar/>
            <h4>User</h4>
        </div>

        <div className="story" style={{backgroundImage:'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR132TBAD0-GhGhN8_2Xr-3obkFd4NzFbk6Hg&s)'}}>
            <Avatar/>
            <h4>User</h4>
        </div>

        <div className="story" style={{backgroundImage:'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR132TBAD0-GhGhN8_2Xr-3obkFd4NzFbk6Hg&s)'}}>
            <Avatar/>
            <h4>User</h4>
        </div>

        <div className="story" style={{backgroundImage:'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR132TBAD0-GhGhN8_2Xr-3obkFd4NzFbk6Hg&s)'}}>
            <Avatar/>
            <h4>User</h4>
        </div>
    </div>
  )
}

export default Story