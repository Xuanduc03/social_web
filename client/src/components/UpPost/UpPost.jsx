import { Avatar, IconButton, Modal } from "@mui/material";
import React, { useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CloseIcon from "@mui/icons-material/Close";
import "./UpPost.scss";

function UpPost() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className="modalPop">
          <form>
            <div className="modalHeading">
              <h3>Tạo bài viết</h3>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>

            <div className="modalHeaderTop">
              <Avatar />
              <h5>User</h5>
            </div>

            <div className="modalBody">
              <textarea
                rows="5"
                placeholder="Bạn đang nghĩ gì?"
                name=""
                id=""
              ></textarea>
            </div>

            <div className="modalFooter">
              <div className="modalOptions">
                <div className="modalOption">
                  <AddPhotoAlternateIcon style={{ color: "green" }} />
                  <p>Ảnh/Video</p>
                </div>
                <div className="modalOption">
                  <EmojiEmotionsIcon style={{ color: "#ffb100" }} />
                  <p>Cảm xúc/Hoạt động</p>
                </div>
              </div>
            </div>

            <input type="submit" className="postSubmit" value="Đăng" />
          </form>
        </div>
      </Modal>

      <div className="upPost">
        <div className="upPostTop">
          <Avatar src="" />
          <input type="text" placeholder="Nam ơi, bạn đang nghĩ gì thế?" onClick={handleOpen} />
        </div>

        <div className="upPostBottom">
          <div className="upPostOption">
            <AddPhotoAlternateIcon style={{ color: "green" }} />
            <p>Ảnh/video</p>
          </div>
          <div className="upPostOption">
            <EmojiEmotionsIcon style={{ color: "#ffb100" }} />
            <p>Cảm xúc/Hoạt động</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpPost;
