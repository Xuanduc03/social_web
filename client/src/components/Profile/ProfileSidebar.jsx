/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import "./ProfileSidebar.scss";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Box, TextField, Button } from "@mui/material";
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
    email: "",
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
          setUser(response.data.data);
          setFormData({
            job: response.data.data.job || "",
            address: response.data.data.address || "",
            phone: response.data.data.phone || "",
            email: response.data.data.email || "",
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
  //  try {
  //   const response = await axios.put(`http://localhost:8080/api/user/${userId}/info`, formData, {
  //     withCredentials: true,
  //   });

  //   if (response.data.success) {
  //     setUser({ ...user, ...formData }); 
  //     toast.success("Cập nhật thông tin thành công!");
  //     setIsEditModalOpen(false); 
  //   } else {
  //     toast.error("Cập nhật thất bại!");
  //   }
  // } catch (error) {
  //   console.error("Lỗi khi cập nhật:", error);
  //   toast.error("Lỗi khi cập nhật thông tin!");
  // }


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
          <h3>Chỉnh sửa thông tin</h3>
          <TextField
            label="Công việc"
            fullWidth
            name="job"
            value={formData.job}
            onChange={handleInputChange}
            margin="dense"
          />
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
          <div className="modal-actions">
            <Button onClick={handleCloseModal} variant="outlined">Hủy</Button>
            <Button onClick={handleSaveInfo} variant="contained" color="primary">Lưu</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default ProfileSidebar;