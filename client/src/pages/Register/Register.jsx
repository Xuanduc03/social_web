import React, { useState } from "react";
import styles from "./Register.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    birthday: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Đăng ký thành công");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      // Xử lý lỗi chi tiết từ backend
      const errorMessage = error.response?.data?.message || "Lỗi kết nối server, vui lòng thử lại!";
      console.error("Registration Error:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerLeft}>
          <h1>Đăng ký để trải nghiệm</h1>
          <p>Kết nối bạn bè muôn nơi trải nghiệm ngay.</p>
        </div>

        <div className={styles.registerRight}>
          <div className={styles.registerBox}>
            <h2>Đăng ký</h2>
            
            <form onSubmit={handleSubmit} method="post">
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Họ"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Tên"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Số điện thoại hoặc email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
              />

              <label>Birthday:</label>
              <input
                type="date"
                name="birthday"
                value={form.birthday}
                onChange={handleChange}
                required
              />

              <label>Gender:</label>
              <div className={styles.genderGroup}>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="nam"
                    onChange={handleChange}
                    required
                  />
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="nữ"
                    onChange={handleChange}
                    required
                  />
                  Nữ
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Khác"
                    onChange={handleChange}
                    required
                  />
                  Khác
                </label>
              </div>

              <button type="submit" className={styles.registerButton}>
                Đăng ký ngay
              </button>

              <p className={styles.link}>
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;