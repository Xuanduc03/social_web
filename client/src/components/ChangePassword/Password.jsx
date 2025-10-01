import React, { useState } from "react";
import styles from "./Password.scss";
import classNames from "classnames/bind";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
        toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
    }

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/change-password`,
            {
                currentPassword,
                newPassword,
            },
            { withCredentials: true }
        );

        if (response.data.success) {
            toast.success(response.data.message);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            await axios.get(`${process.env.REACT_APP_API_URL}/logout`, { withCredentials: true });
            navigate("/login");
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
};

  return (
    <div className={cx("settings-container")}>
      <Typography variant="h4" gutterBottom>
        Cài đặt
      </Typography>
      <form onSubmit={handleChangePassword} className={cx("password-form")}>
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={cx("submit-button")}
        >
          Đổi mật khẩu
        </Button>
      </form>
    </div>
  );
}

export default ChangePassword;