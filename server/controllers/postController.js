const Post = require('../models/post');
const mongoose = require('mongoose');
const path = require('path'); // Thêm path để xử lý đường dẫn

// Tạo bài viết
module.exports.createPost = async (req, res) => {
  try {
    const { content } = req.body; // Lấy content từ req.body (đã parse bởi multer)
    const userId = req.user?.id; // Lấy từ middleware authProtect
    const files = req.files?.images || []; // Lấy danh sách file ảnh từ req.files

    console.log("Content received:", content);
    console.log("Files received:", files);

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    if (!content || !content.trim()) { // Kiểm tra content không rỗng hoặc chỉ chứa khoảng trắng
      return res.status(400).json({
        message: "Nội dung bài viết là bắt buộc",
        success: false,
        error: true,
      });
    }

    const images = files.map(file => ({
      url: `http://localhost:8080/uploads/${path.basename(file.path)}` // Trả về URL đầy đủ
    })); // Lưu dưới dạng object với trường url

    const newPost = new Post({
      user: userId,
      content: content.trim(),
      images: images.length > 0 ? images : [], // Nếu có ảnh, lưu như mảng object
    });

    const savedPost = await newPost.save();
    await savedPost.populate('user', 'firstName lastName avatar'); // Populate thông tin user

    res.status(201).json({
      data: savedPost,
      message: "Tạo bài viết thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi tạo bài viết",
      success: false,
      error: true,
    });
  }
};

// Lấy tất cả bài viết
module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'firstName lastName avatarImage')
      .populate('comments.user', 'firstName lastName avatar')
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất trước

    res.status(200).json({
      data: posts,
      message: "Lấy danh sách bài viết thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get All Posts Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi lấy danh sách bài viết",
      success: false,
      error: true,
    });
  }
};

// Lấy bài viết theo ID
module.exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "ID bài viết không hợp lệ",
        success: false,
        error: true,
      });
    }

    const post = await Post.findById(postId)
      .populate('user', 'firstName lastName avatar')
      .populate('comments.user', 'firstName lastName avatar');

    if (!post) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      data: post,
      message: "Lấy bài viết thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get Post Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi lấy bài viết",
      success: false,
      error: true,
    });
  }
};

// Cập nhật bài viết
module.exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, images } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "ID bài viết không hợp lệ",
        success: false,
        error: true,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết",
        success: false,
        error: true,
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền chỉnh sửa bài viết này",
        success: false,
        error: true,
      });
    }

    post.content = content || post.content;
    post.images = images || post.images;
    const updatedPost = await post.save();
    await updatedPost.populate('user', 'firstName lastName avatar');

    res.status(200).json({
      data: updatedPost,
      message: "Cập nhật bài viết thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi cập nhật bài viết",
      success: false,
      error: true,
    });
  }
};

// Xóa bài viết
module.exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "ID bài viết không hợp lệ",
        success: false,
        error: true,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết",
        success: false,
        error: true,
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa bài viết này",
        success: false,
        error: true,
      });
    }

    await Post.deleteOne({ _id: postId });

    res.status(200).json({
      message: "Xóa bài viết thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi xóa bài viết",
      success: false,
      error: true,
    });
  }
};

// Thích/Bỏ thích bài viết
module.exports.toggleLikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "ID bài viết không hợp lệ",
        success: false,
        error: true,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết",
        success: false,
        error: true,
      });
    }

    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    await updatedPost.populate('user', 'firstName lastName avatar');

    res.status(200).json({
      data: updatedPost,
      message: liked ? "Bỏ thích bài viết thành công" : "Thích bài viết thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Toggle Like Post Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi thích/bỏ thích bài viết",
      success: false,
      error: true,
    });
  }
};

// Bình luận bài viết
module.exports.commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    if (!text) {
      return res.status(400).json({
        message: "Nội dung bình luận là bắt buộc",
        success: false,
        error: true,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        message: "ID bài viết không hợp lệ",
        success: false,
        error: true,
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết",
        success: false,
        error: true,
      });
    }

    post.comments.push({ user: userId, text });
    const updatedPost = await post.save();
    await updatedPost.populate('user', 'firstName lastName avatar');
    await updatedPost.populate('comments.user', 'firstName lastName avatar');

    res.status(200).json({
      data: updatedPost,
      message: "Bình luận bài viết thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Comment Post Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi bình luận bài viết",
      success: false,
      error: true,
    });
  }
};