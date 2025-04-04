const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const storySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ["text", "image", "video"],
            required: true,
        },
        title: {
            type: String,
            trim: true,
        },
        media: [
            {
                url: {
                    type: String,
                    trim: true,
                    required : true
                },
                public_id: {
                    type: String,
                    required: true,
                },
                type: {
                    type: String,
                    enum: ["image", "video"], // Phân biệt loại media
                    required: true,
                },
                duration: { // Thời lượng (dành cho video)
                    type: Number,
                    default: null,
                },
            },
        ],
        bgColor: {
            type: String, // Lưu màu nền nếu là story văn bản
            default: "#ffffff",
        },
        views: [ // Lưu danh sách người đã xem
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                viewedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
            expires: "24h", // Tự động xoá sau 24 giờ
        },
    },
    { timestamps: true }
);

//  Middleware tự động xóa ảnh khi Story bị xóa
storySchema.pre("remove", async function (next) {
    try {
        if (this.media && this.media.length > 0) {
            for (const item of this.media) {
                await cloudinary.uploader.destroy(item.public_id, {
                    resource_type: item.type === "video" ? "video" : "image",
                });
                console.log(`Đã xóa ${item.type} với public_id: ${item.public_id} trên Cloudinary`);
            }
        }
        next();
    } catch (err) {
        console.error("Lỗi khi xóa tài nguyên trên Cloudinary:", err);
        next(err);
    }
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;

