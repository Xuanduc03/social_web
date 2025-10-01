import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar, IconButton, Modal } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CloseIcon from "@mui/icons-material/Close";
import "./UpPost.scss"; // Tái sử dụng SCSS từ UpPost

function UpGroupPost({ groupId, onPostCreated, isMember }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/me`, { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setContent("");
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleContentChange = (e) => setContent(e.target.value);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      toast.error("Bạn chỉ có thể chọn tối đa 4 ảnh!");
      return;
    }
    setSelectedFiles(files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng bài!");
      return;
    }
    if (!content.trim() && selectedFiles.length === 0) {
      toast.error("Vui lòng nhập nội dung hoặc chọn ít nhất một ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("content", content.trim());
    selectedFiles.forEach((file, index) => {
      formData.append("images", file); // Đảm bảo key là "images" khớp với backend
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/groups/${groupId}/posts`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        toast.success("Đăng bài trong nhóm thành công!");
        handleClose();
        onPostCreated(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng bài!");
    }
  };

  if (!isMember) return null; // Chỉ thành viên mới thấy ô đăng bài

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className="modalPop">
          <form onSubmit={handleSubmit}>
            <div className="modalHeading">
              <h3>Tạo bài viết trong nhóm</h3>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="modalHeaderTop">
              <Avatar src={loading ? "" : user?.avatarImage[0].url || ""} />
              <h5>{loading ? "Loading..." : user ? `${user.firstName} ${user.lastName}` : "Guest"}</h5>
            </div>
            <div className="modalBody">
              <textarea
                name="content"
                rows="5"
                placeholder="Bạn đang nghĩ gì trong nhóm này?"
                value={content}
                onChange={handleContentChange}
              />
              {previewUrls.length > 0 && (
                <div className="previewImages">
                  {previewUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Preview ${index}`} className="previewImage" />
                  ))}
                </div>
              )}
            </div>
            <div className="modalFooter">
              <div className="modalOptions">
                <div className="modalOption">
                  <label htmlFor="fileInput" className="fileLabel">
                    <AddPhotoAlternateIcon style={{ color: "green" }} />
                    <p>Ảnh/Video</p>
                  </label>
                  <input
                    id="fileInput"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
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
          <Avatar src={loading ? "" : user?.avatarImage || ""} />
          <input
            type="text"
            placeholder="Bạn đang nghĩ gì trong nhóm này?"
            onClick={handleOpen}
          />
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

export default UpGroupPost;