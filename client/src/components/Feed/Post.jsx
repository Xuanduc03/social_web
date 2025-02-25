import React from 'react'
import './Post.scss'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
function Post({photoURL, image, username, time, message }) {
  return (
    <div className='post'>
        <div className='postTop'>
            <div className='postTopLeft'>
                <Avatar src={photoURL}/>
                <div className='postInfo'>
                    <h4>{username}</h4>
                    <p>{time}<PublicIcon/></p>
                </div>    
            </div>
            <MoreHorizIcon/>
        </div>
        <div className='postMid'>
            <p>
                {message}
            </p>
            {image && <img src={image} alt="" />}
        </div>
        <div className='postBottom'>
            <div className='postBottomOptions'>
                <div>
                <ThumbUpIcon/> <p>Like</p>
                </div>
                <div>
                <CommentIcon/> <p>Comment</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Post