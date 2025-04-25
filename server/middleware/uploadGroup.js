const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Kiểm tra cấu hình Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Thiếu cấu hình Cloudinary trong file .env");
}

// Cấu hình CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "groups", // Thư mục lưu ảnh trên Cloudinary
    format: async () => "jpg", // Định dạng mặc định
    public_id: (req, file) => `group-${Date.now()}-${file.originalname}`,
  },
});

// Chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) { 
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (jpeg, jpg, png)!"), false);
  }
};

// Khởi tạo multer với cấu hình
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Giới hạn kích thước file: 5MB
}).array("coverImage", 1); // Chấp nhận tối đa 4 file với field name là "images"

// Middleware upload
module.exports = (req, res, next) => {
  upload(req, res, (err) => { // Sửa "uploadCloud" thành "upload"
    if (err instanceof multer.MulterError) {
      // Lỗi từ multer (ví dụ: vượt quá số lượng file, kích thước file quá lớn)
      return res.status(400).json({
        message: err.message || "Lỗi khi upload file",
        success: false,
        error: true,
      });
    } else if (err) {
      // Lỗi khác (ví dụ: file không phải ảnh)
      return res.status(400).json({
        message: err.message || "Lỗi khi upload file",
        success: false,
        error: true,
      });
    }
    next();
  });
};