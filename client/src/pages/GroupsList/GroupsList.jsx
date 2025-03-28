import React, { useState, useEffect } from "react";
import styles from "./GroupsList.module.scss";
import axios from "axios";
import GroupCard from "~/components/Group/GroupCard";
import Sidebar from "~/components/Layout/Sidebar";

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null); // State cho file ảnh
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  // Lấy danh sách nhóm
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/groups", {
          withCredentials: true,
        });
        if (response.data.success) {
          setGroups(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhóm:", error);
      }
    };
    fetchGroups();
  }, []);

  // Xử lý thay đổi file ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
  if (file) {
    setCoverImage(file);
    setCoverImagePreview(URL.createObjectURL(file)); // Tạo URL tạm để preview
  }
};

  // Xử lý tạo nhóm
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
  
      const response = await axios.post("http://localhost:8080/api/groups", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.data.success) {
        setGroups((prev) => [response.data.data, ...prev]);
        setName("");
        setDescription("");
        setCoverImage(null);
        alert("Tạo nhóm thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi tạo nhóm:", error);
      alert("Lỗi khi tạo nhóm: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className={styles.groupsListPage}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        {/* Phần tạo nhóm */}
        <div className={styles.createGroupSection}>
          <h2>Tạo nhóm mới</h2>
          <form onSubmit={handleCreateGroup}>
            <div className={styles.formGroup}>
              <label>Tên nhóm:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên nhóm"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mô tả:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả về nhóm"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Ảnh bìa:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {coverImage && (
                <p>Đã chọn: {coverImage.name}</p> // Hiển thị tên file đã chọn
              )}
              {coverImagePreview && (
                <img src={coverImagePreview} alt="Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
              )}

            </div>
            <div className={styles.formGroup}>
            </div>
            <button type="submit" className={styles.createButton}>
              Tạo nhóm
            </button>
          </form>
        </div>

        {/* Danh sách nhóm */}
        <div className={styles.groupsSection}>
          <h2>Danh sách nhóm</h2>
          {groups.length > 0 ? (
            <div className={styles.groupsGrid}>
              {groups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          ) : (
            <p>Chưa có nhóm nào!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsList;