import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Avatar, IconButton, Modal } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CloseIcon from "@mui/icons-material/Close";
import "./UpPost.scss";

function UpPost() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Lấy thông tin người dùng
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
    if (files.length > 4) { // Giới hạn tối đa 4 ảnh
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
    if (!content.trim() && selectedFiles.length === 0) { // Sử dụng trim() để kiểm tra khoảng trắng
      toast.error("Vui lòng nhập nội dung hoặc chọn ít nhất một ảnh!");
      return;
    }
  
    const formData = new FormData();
    formData.append("content", content.trim()); // Đảm bảo gửi content không rỗng
    selectedFiles.forEach((file) => formData.append("images", file)); // Gửi nhiều file nếu có
  
    // Log dữ liệu gửi lên để kiểm tra
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axios.post("http://localhost:8080/api/posts", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Đăng bài viết thành công!");
        handleClose();
      } else {
        toast.error(response.data.message || "Đăng bài thất bại!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng bài!");

      console.log("Lỗi chi tiết:", error.response?.data || error.message);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <div className="modalPop">
          <form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
            <div className="modalHeading">
              <h3>Tạo bài viết</h3>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>

            <div className="modalHeaderTop">
              <Link to="/profile" className="uploadinfo">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                <Avatar
                  src={loading ? "" : user?.avatarImage || ""}
                  alt={user ? `${user.firstName} ${user.lastName}` : "Guest"}
                />
                <h5>{loading ? "Loading..." : user ? `${user.firstName} ${user.lastName}` : "Guest"}</h5>
              </Link>
            </div>

            <div className="modalBody">
              <textarea
                name="content"  // 🔥 Thêm name để FormData tự động nhận
                rows="5"
                placeholder="Bạn đang nghĩ gì?"
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
                    name="images[]" // 🔥 Đặt name để FormData tự động lấy files
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
          <Avatar
            src={loading ? "" : user?.avatarImage || ""}
            alt={user ? `${user.firstName} ${user.lastName}` : "Guest"}
          />
          <input
            type="text"
            placeholder={`${loading ? "Loading..." : user ? user.lastName : "Guest"} ơi, bạn nghĩ gì vậy?`}
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

export default UpPost;