/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "./ProfileSidebar.scss";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Box, TextField, Button, FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import { toast } from "react-toastify";

const ProfileSidebar = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // lưu thông tin 
  const [formData, setFormData] = useState({
    job: "",
    address: "",
    phone: "",
    gender: "nam",
    email: "",
    birthday: "",
    bio: "",
    social: "",
    maritalStatus: "độc thân",
  });
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/me", { withCredentials: true });
        if (response.data.success) {
          setCurrentUser(response.data.data._id);
        } else {
          console.log("Không lấy được thông tin user:", response.data.message);
        }
      } catch (error) {
        console.log("Lỗi khi lấy thông tin:", error.response?.data || error.message);
      }
    };
    fetchUser();
  }, []);


  // Gọi API lấy thông tin bài viết của người dùng
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/user/${userId}`);
        if (response.data.success) {
          setPosts(response.data.data);
        } else {
          console.error("Không thể lấy bài viết!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      }
    };
    fetchUserPosts();
  }, [userId]);

  // Gọi API lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`, { withCredentials: true });
        if (response.data.success) {
          const userData = response.data.data;
          setUser(userData);
          setFormData({
            job: userData.job || "",
            address: userData.address || "",
            phone: userData.phone || "",
            email: userData.email || "",
            birthday: userData.birthday || "",
            gender: userData.gender || "nam",
            bio: userData.bio || "",
            social: userData.social || "",
            maritalStatus: userData.maritalStatus || "độc thân",
          });
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
  }, [userId]);
  


  const handleOpenModal = () => {
    setIsEditModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleSaveInfo = async () => {
    console.log(" Data gửi đi:", formData);
    try {
      const response = await axios.put("http://localhost:8080/api/user/update-info", formData,  { withCredentials: true });
      if (response.data.success) {
        toast.success("Cập nhật thành công!");
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
    }

  };

  return (
    <>
      <div className="profile-sidebar">
        <div className="sidebar-section">
          <h3>Giới thiệu</h3>
          <p>Công việc: {user?.job || "Chưa cập nhật"}</p>
          <p>Địa chỉ: {user?.address || "Chưa cập nhật"}</p>
          <p>Số điện thoại: {user?.phone || "Chưa cập nhật"}</p>
          <p>Email: {user?.email || "Chưa cập nhật"}</p>

          {currentUser === userId && (
            <button onClick={handleOpenModal}>Chỉnh sửa chi tiết</button>
          )}
        </div>

        <div className="sidebar-section">
          <h3>Ảnh</h3>
          <Link href={"#"}>Xem tất cả ảnh</Link>
          <div className="photos-grid">
            {posts.map((post) => (
              <div key={post.id}>
                {post.images.map((img, index) => (
                  <img key={index} src={img.url} alt="Ảnh" />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3>Bạn bè</h3>
          <p>{loading ? "..." : user?.friends?.length || 0} Người bạn</p>
          <a href="#">Xem tất cả bạn bè</a>
        </div>
      </div>

      {/* Modal chỉnh sửa thông tin */}
      <Modal open={isEditModalOpen} onClose={handleCloseModal}>
        <Box className="modal-container">
          <h3>Chỉnh sửa thông tin cá nhân</h3>

          <div className="modal-content">
            {/* Cột 1 */}
            <div className="modal-column">
              <TextField
                label="Công việc"
                fullWidth
                name="job"
                value={formData.job}
                onChange={handleInputChange}
                margin="dense"
              />
              {/* Giới tính */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="maritalStatus"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <MenuItem value="nam">Nam</MenuItem>
                  <MenuItem value="nữ">Nữ</MenuItem>
                  <MenuItem value="Khác">Khác</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Địa chỉ"
                fullWidth
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                margin="dense"
              />
              <TextField
                label="Số điện thoại"
                fullWidth
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                margin="dense"
              />
              <TextField
                label="Email"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="dense"
              />
            </div>

            {/* Cột 2 */}
            <div className="modal-column">
              <TextField
                label="Ngày sinh"
                type="date"
                fullWidth
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                margin="dense"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Giới thiệu bản thân"
                fullWidth
                multiline
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                margin="dense"
              />
              <TextField
                label="Link Mạng Xã Hội (Facebook, LinkedIn, ...)"
                fullWidth
                name="social"
                value={formData.social}
                onChange={handleInputChange}
                margin="dense"
              />
              {/* Tình trạng hôn nhân */}
              <FormControl fullWidth margin="dense">
                <InputLabel>Tình trạng hôn nhân</InputLabel>
                <Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                >
                  <MenuItem value="độc thân">Độc thân</MenuItem>
                  <MenuItem value="đã kết hôn">Đã kết hôn</MenuItem>
                  <MenuItem value="ly hôn">Ly hôn</MenuItem>
                  <MenuItem value="mập mờ">Mập mờ</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="modal-actions">
            <Button onClick={handleCloseModal} className="btn-cancel">Hủy</Button>
            <Button onClick={handleSaveInfo} className="btn-save">Lưu</Button>
          </div>
        </Box>
      </Modal>


    </>
  );
};

export default ProfileSidebar;