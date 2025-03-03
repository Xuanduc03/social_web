const express = require("express");
const { Login, Register, Logout, GetUser, SetAvatar } = require("../controllers/userController");
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    toggleLikePost,
    commentPost,
  } = require('../controllers/postController');
const {authProtect}  = require("../middleware/authProtect");
const upload = require("../middleware/uploadAvatar");


const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);
router.get('/logout', Logout);
router.get('/me',authProtect, GetUser);
router.post('/upload-avatar', authProtect, upload.single("avatar"), SetAvatar);


router.get('/posts', getAllPosts); // Lấy tất cả bài viết (công khai)
router.get('/posts/:id', getPostById); // Lấy bài viết theo ID (công khai)
router.post('/posts', authProtect, createPost); // Tạo bài viết (yêu cầu đăng nhập)
router.put('/posts/:id', authProtect, updatePost); // Cập nhật bài viết (yêu cầu đăng nhập)
router.delete('/posts/:id', authProtect, deletePost); // Xóa bài viết (yêu cầu đăng nhập)
router.post('/posts/:id/like', authProtect, toggleLikePost); // Thích/bỏ thích bài viết
router.post('/posts/:id/comment', authProtect, commentPost); // Bình luận bài viết

module.exports = router;