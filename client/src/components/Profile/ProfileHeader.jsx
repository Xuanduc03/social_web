import React, { useEffect, useState } from "react";
import styles from "./ProfileHeader.module.scss"; // Sửa import thành module
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "@mui/material";

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
        if (response.data.success) {
          setUser(response.data.data);
          console.log("Thông tin user:", response.data.data);
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
      <div className={styles.coverPhoto}>
        <button className={styles.editCover}>Thêm ảnh bìa</button>
      </div>
      <div className={styles.profileInfo}>
        <div className={styles.avatarContainer}>
          <img
            src={user?.avatarImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlpgOzwjh3d5VTbE4aqLWMaSSCIb7Xlj3aw&s"}
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
            {loading ? "..." : user?.friendsCount || "Friend"}
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.addStory}>+ Thêm vào tin</button>
          <button className={styles.editProfile}>✏ Chỉnh sửa trang cá nhân</button>
        </div>
      </div>

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