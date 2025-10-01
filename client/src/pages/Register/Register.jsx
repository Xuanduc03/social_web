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
          <h1>Social Humg</h1>
          <p>Connect with friends and the world around you on Facebook.</p>
        </div>

        <div className={styles.registerRight}>
          <div className={styles.registerBox}>
            <h2>Sign Up</h2>
            <p>It’s free and always will be.</p>

            <form onSubmit={handleSubmit} method="post">
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Mobile number or email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="New password"
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
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="nữ"
                    onChange={handleChange}
                    required
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Khác"
                    onChange={handleChange}
                    required
                  />
                  Other
                </label>
              </div>

              <button type="submit" className={styles.registerButton}>
                Sign Up
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