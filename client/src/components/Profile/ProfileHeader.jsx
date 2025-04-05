import React, { useState } from "react";
import styles from "./ProfileHeader.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";

const ProfileHeader = ({ user, loading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [coverModalOpen, setCoverModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
      toast.error("Không thể xác định người dùng!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("userId", user._id);

    try {
      const response = await axios.post("http://localhost:8080/api/upload-cover", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
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
      toast.error("Không thể xác định người dùng!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    formData.append("userId", user._id);

    try {
      const response = await axios.post("http://localhost:8080/api/upload-avatar", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success("Upload avatar thành công");
        handleCloseModal();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi upload avatar!");
    }
  };

  if (loading) {
    return (
      <div className={styles.profileHeaderSkeleton}>
        <div className={styles.skeletonCover}></div>
        <div className={styles.profileInfo}>
          <div className={styles.skeletonAvatar}></div>
          <div className={styles.skeletonName}></div>
          <div className={styles.skeletonFriends}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileHeader}>
      <div className={styles.coverPhoto} style={{ backgroundImage: `url(${user?.coverPhoto[0].url || ''})` }}>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.avatarContainer}>
          <img
            src={user?.avatarImage[0].url || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
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