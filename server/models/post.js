const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
    content: {
      type: String,
      required: true,
      trim: true, 
      minlength: 1,
      maxlength: 5000,
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
  },
  { timestamps: true }
);

// Thêm index compound nếu cần truy vấn theo thời gian và user
PostSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Post", PostSchema);