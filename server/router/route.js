const express = require("express");
const { Login, Register, Logout, GetUser, SetAvatar, GetUserById, GetFriends, searchFriends, searchUsers, cancelFriendRequest } = require("../controllers/userController");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLikePost,
  commentPost,
  getPostsByUserId,
  GetLikePostById,
  GetCommentPostById,
  sharePost,
} = require('../controllers/postController');

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getSuggestedFriends,
} = require("../controllers/userController");

const {
  createGroup,
  getAllGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  createGroupPost,
  deleteGroup,
} = require("../controllers/groupController");

const { authProtect } = require("../middleware/authProtect");
const uploadAvatar = require("../middleware/uploadAvatar"); // Middleware upload avatar
const uploadPost = require("../middleware/uploadPostMiddle"); // Middleware upload post (sau khi cập nhật)
const upload = require("../middleware/uploadCloud");

const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);
router.get('/logout', Logout);
router.get('/me', authProtect, GetUser);
router.get('/user/:id', authProtect, GetUserById);
router.post('/upload-avatar', authProtect, uploadAvatar.single("avatar"), SetAvatar);


router.get('/posts',authProtect, getAllPosts); // Lấy tất cả bài viết (công khai)
router.get('/posts/:id', getPostById); // Lấy bài viết theo ID (công khai)
router.get("/posts/user/:userId",getPostsByUserId);// Lấy bài viết theo ID (người dùng)
router.post('/posts', authProtect, upload , createPost); // Tạo bài viết (yêu cầu đăng nhập, sử dụng multer mới)
router.put('/posts/:id', authProtect, updatePost); // Cập nhật bài viết (yêu cầu đăng nhập)
router.delete('/posts/:id', authProtect, deletePost); // Xóa bài viết (yêu cầu đăng nhập)
router.post('/posts/:id/like', authProtect, toggleLikePost); // Thích/bỏ thích bài viết
router.post('/posts/:id/comment', authProtect, commentPost); // Bình luận bài viết
router.get("/posts/:id/likes", authProtect, GetLikePostById); //lấy danh sách like theo id bài viết
router.get("/posts/:id/comments", authProtect, GetCommentPostById);

//  Gợi ý bạn bè (popup)
router.get("/search-friends", searchFriends);
//  Tìm kiếm toàn bộ người dùng (Enter)
router.get("/search-users", searchUsers);

//hủy lời mòi
router.post("/cancel-friend-request", cancelFriendRequest);

//  Gợi ý bạn bè (popup)
router.get("/search-friends", searchFriends);
//  Tìm kiếm toàn bộ người dùng (Enter)
router.get("/search-users", searchUsers);

//hủy lời mòi
router.post("/cancel-friend-request", cancelFriendRequest);

// API chia sẻ bài viết
router.get("/posts/share/:postId", getPostById);
router.post("/posts/:postId/share",authProtect, sharePost);

// Routes chức năng kết bạn
router.get("/all-friends", authProtect, GetFriends);
router.post("/send-friend-request", authProtect, sendFriendRequest);
router.post("/accept-friend-request", authProtect, acceptFriendRequest);
router.post("/reject-friend-request", authProtect, rejectFriendRequest);
router.get("/friend-requests", authProtect, getFriendRequests);
router.get("/suggested-friends", authProtect, getSuggestedFriends);


router.post("/groups", authProtect, upload, createGroup);
router.get("/groups", getAllGroups); // Công khai
router.get("/groups/:groupId", getGroupById);
router.post("/groups/:groupId/join", authProtect, joinGroup);
router.post("/groups/:groupId/leave", authProtect, leaveGroup);
router.post("/groups/:groupId/posts", authProtect, uploadPost, createGroupPost);
router.delete("/groups/:groupId", authProtect, deleteGroup);
module.exports = router;