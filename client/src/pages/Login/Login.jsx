import React, { useState } from "react";
import styles from "./Login.module.scss";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, form, { withCredentials: true });

      if (response.data.success) {
        toast.success("Đăng nhập thành công");
        navigate("/"); 
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("Đăng nhập thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginLeft}>
          <h1>Social Telink</h1>
        </div>

        <div className={styles.loginRight}>
          <div className={styles.loginBox}>
            <h2>Đăng nhập</h2>
            <p>Chào mừng bạn trở lại.</p>

            <form onSubmit={handleSubmit} method="post">
              <input
                type="email"
                name="email"
                placeholder="Email"
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

              <button type="submit" className={styles.loginButton}>
                Đăng nhập
              </button>

              <a href="#" className={styles.forgotPassword}>
                Quên mật khẩu?
              </a>

              <div className={styles.divider}></div>

              <button
                type="button"
                className={styles.registerLink}
                onClick={() => navigate("/register")}
              >
                Tạo tài khoản mới
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;