import { Avatar, IconButton, Modal } from '@mui/material'
import React, { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import "./MessageSender.scss"
import CloseIcon from '@mui/icons-material/Close';
function MessageSender() {
    const [open,setOpen] = useState(true)
    const handleClose=()=>{
        setOpen(false)
    }
    const handleOpen=()=>{
        setOpen(true)
    }
  return (
    <>
    <Modal open={open} onClose={handleClose}>
        <div className='modalPop'>
            <form>
                <div className='modalHeading'>
                    <h3>Create Post</h3>
                    <IconButton onClick={handleClose}>
                        <CloseIcon/>
                    </IconButton>
                </div>

                <div className='modalHeaderTop'>
                    <Avatar/>
                    <h5>User</h5>
                </div>

                <div className='modalBody'>
                    <textarea rows="5" placeholder="...."name="" id=""></textarea>
                </div>

                <div className='modalFooter'>
                    <div className='modalFooterLeft'>
                        <h4>Add post</h4>
                    </div>
                </div>
                <input type="submit" className='postSubmit' value="Post" />
            </form>
        </div>
    </Modal>
    <div className="messagesender">
        <div className="messagesenderTop">
            <Avatar/>

            <form>
                <input type="text" placeholder="............." onClick={handleOpen} />
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
    </>
  )
}

export default MessageSender