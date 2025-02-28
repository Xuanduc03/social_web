import React, { useState } from "react";
import styles from "./Register.module.scss";

const Register = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data:", form);
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h2>Đăng ký</h2>
        <p>Miễn phí và sẽ luôn như vậy.</p>

        <form onSubmit={handleSubmit}>
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
            placeholder="Email hoặc số điện thoại"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu mới"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Ngày sinh:</label>
          <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            required
          />

          <label>Giới tính:</label>
          <div className={styles.genderGroup}>
            <label>
              <input
                type="radio"
                name="gender"
                value="Nam"
                onChange={handleChange}
                required
              />
              Nam
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Nữ"
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
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
