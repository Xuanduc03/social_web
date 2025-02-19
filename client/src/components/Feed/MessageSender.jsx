import { Avatar } from '@mui/material'
import React from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import "./MessageSender.scss"
function MessageSender() {
  return (
    <div className="messagesender">
        <div className="messagesenderTop">
            <Avatar/>

            <form>
                <input type="text" placeholder="............." />
            </form>
        </div>

        <div className="messagesenderBottom">
            <div className="messagerOptions">
                <AddPhotoAlternateIcon style={{color:'lightgreen'}} fontSize="large"/>
                <p>Add Photo</p>
            </div>

            <div className="messagerOptions">
                <EmojiEmotionsIcon style={{color: '#ffb100'}} fontSize="large"/>
                <p>Feeling</p>
            </div>
        </div>
    </div>
  )
}

export default MessageSender