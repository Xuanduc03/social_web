import React, { useEffect, useState } from "react";
import styles from "./ProfileHeader.module.scss"; // Sửa import thành module
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";
import { useParams } from "react-router-dom";

const ProfileHeader = () => {
  const {userId} = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`, { withCredentials: true });
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
  }, );

  const handleOpenCoverModal = () => setCoverModalOpen(true);
  const handleCloseCoverModal = () => {
    setCoverModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCoverUpload = async () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn ảnh để upload!");
      return;
    }

    if (!user || !user._id) {
      toast.error("Không thể xác định người dùng, vui lòng đăng nhập lại!");
      return;
    }

    const formData = new FormData();
    formData.append("coverPhoto", selectedFile); // Đổi "avatar" thành "coverPhoto"
    formData.append("userId", user._id);

    try {
      const response = await axios.post("http://localhost:8080/api/upload-cover", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setUser({ ...user, coverPhoto: response.data.data.coverPhoto }); // Cập nhật ảnh bìa
        toast.success("Upload ảnh bìa thành công");
        handleCloseCoverModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi upload ảnh bìa!");
    }
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };


const handleUpload = async () => {
  if (!selectedFile) {
    toast.error("Vui lòng chọn ảnh để upload!");
    return;
  }

  if (!user || !user._id) {
    toast.error("Không thể xác định người dùng, vui lòng đăng nhập lại!");
    return;
  }

  const formData = new FormData();
  formData.append("avatar", selectedFile);
  formData.append("userId", user.id);

  try {
    console.log(selectedFile);
    const response = await axios.post("http://localhost:8080/api/upload-avatar", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      setUser({ ...user, avatar: response.data.data.avatar });
      toast.success("Upload avatar thành công");
      handleCloseModal();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Lỗi upload avatar!");
  }
};
  
  return (
    <div className={styles.profileHeader}>
      <div className={styles.coverPhoto} style={{ backgroundImage: `url(${user?.coverPhoto || ''})` }}>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.avatarContainer}>
          <img
            src={user?.avatarImage || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
            alt="Avatar"
            className={styles.avatar}
          />
          <button className={styles.editAvatar} onClick={handleOpenModal}>
            📷
          </button>
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>
            {loading ? "Loading..." : user ? `${user.firstName} ${user.lastName}` : "User Name"}
          </h1>
          <p className={styles.friendsCount}>
            {loading ? "..." : user?.friends.length || "Friend"} Người bạn
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.editCover} onClick={handleOpenCoverModal}>
            Thêm ảnh bìa
          </button>
          <button className={styles.addStory}>+ Thêm vào tin</button>
          <button className={styles.editProfile}>✏ Chỉnh sửa trang cá nhân</button>
        </div>
      </div>

      <Modal open={coverModalOpen} onClose={handleCloseCoverModal}>
        <div className={styles.uploadAvatarModal}>
          <h3>Thay đổi ảnh bìa</h3>
          <div className={styles.previewContainer}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            ) : (
              <p>Chưa chọn ảnh</p>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div className={styles.modalActions}>
            <button onClick={handleCoverUpload} className={styles.uploadButton}>
              Tải lên
            </button>
            <button onClick={handleCloseCoverModal} className={styles.cancelButton}>
              Hủy
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Upload Avatar */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div className={styles.uploadAvatarModal}>
          <h3>Thay đổi ảnh đại diện</h3>
          <div className={styles.previewContainer}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            ) : (
              <p>Chưa chọn ảnh</p>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <div className={styles.modalActions}>
            <button onClick={handleUpload} className={styles.uploadButton}>
              Tải lên
            </button>
            <button onClick={handleCloseModal} className={styles.cancelButton}>
              Hủy
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileHeader;