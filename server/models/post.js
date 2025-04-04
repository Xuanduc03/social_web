const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Thêm index để tối ưu truy vấn theo user
    },
    content: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng thừa
      minlength: 1, // Đảm bảo không rỗng
      maxlength: 5000, // Giới hạn độ dài nội dung
    },
    images: [
      {
        url: {
          type: String,
          trim: true,
        },
        public_id: {
          type: String,
          required: true,
          // match: /^https?:\/\/.+/i, // Kiểm tra định dạng URL
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: 1000, // Giới hạn độ dài bình luận
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date, // Thêm để theo dõi chỉnh sửa bình luận
        },
      },
    ],
     sharedPost: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post", // Tham chiếu bài viết gốc
      default: null
    },
    shares: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        sharedAt: {
          type: Date,
          default: Date.now, // Thời điểm chia sẻ
        },
      },
    ],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
  },
  { timestamps: true }
);

// Thêm index compound nếu cần truy vấn theo thời gian và user
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ sharedPost: 1 });

module.exports = mongoose.model("Post", PostSchema);