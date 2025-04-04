const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Thiếu cấu hình Cloudinary trong file .env");
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "stories",
    resource_type: file.mimetype.startsWith("video/") ? "video" : "image", // Hỗ trợ cả ảnh và video
    public_id: `story-${Date.now()}-${file.originalname}`,
  }),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh hoặc video!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB để hỗ trợ video
}).single("media"); // Chấp nhận 1 file với field name "media"

module.exports = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: err.message || "Lỗi khi upload file",
        success: false,
        error: true,
      });
    } else if (err) {
      return res.status(400).json({
        message: err.message || "Lỗi khi upload file",
        success: false,
        error: true,
      });
    }
    next();
  });
};