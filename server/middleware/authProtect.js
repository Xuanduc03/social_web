const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authProtect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Lấy token từ cookie

    if (!token) {
      return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
    }

    // Giải mã token để lấy user ID
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = await User.findById(decoded._id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};
