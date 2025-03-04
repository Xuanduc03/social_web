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

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getSuggestedFriends,
} = require("../controllers/userController");

const { authProtect } = require("../middleware/authProtect");
const uploadAvatar = require("../middleware/uploadAvatar"); // Middleware upload avatar
const uploadPost = require("../middleware/uploadPostMiddle"); // Middleware upload post (sau khi cập nhật)

const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);
router.get('/logout', Logout);
router.get('/me', authProtect, GetUser);
router.post('/upload-avatar', authProtect, uploadAvatar.single("avatar"), SetAvatar);

router.get('/posts',authProtect, getAllPosts); // Lấy tất cả bài viết (công khai)
router.get('/posts/:id', getPostById); // Lấy bài viết theo ID (công khai)
router.post('/posts', authProtect, uploadPost, createPost); // Tạo bài viết (yêu cầu đăng nhập, sử dụng multer mới)
router.put('/posts/:id', authProtect, updatePost); // Cập nhật bài viết (yêu cầu đăng nhập)
router.delete('/posts/:id', authProtect, deletePost); // Xóa bài viết (yêu cầu đăng nhập)
router.post('/posts/:id/like', authProtect, toggleLikePost); // Thích/bỏ thích bài viết
router.post('/posts/:id/comment', authProtect, commentPost); // Bình luận bài viết

// Routes chức năng kết bạn
router.post("/send-friend-request", authProtect, sendFriendRequest);
router.post("/accept-friend-request", authProtect, acceptFriendRequest);
router.post("/reject-friend-request", authProtect, rejectFriendRequest);
router.get("/friend-requests", authProtect, getFriendRequests);
router.get("/suggested-friends", authProtect, getSuggestedFriends);


module.exports = router;