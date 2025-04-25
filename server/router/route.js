const express = require("express");
const {
  Login,
  Register,
  Logout,
  GetUser,
  SetAvatar,
  SetCoverPhoto,
  GetUserById,
  GetFriends,
  searchFriends,
  searchUsers,
  cancelFriendRequest,
  updateUserProfile,
  changePassword

} = require("../controllers/userController");
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
  getPostByIds,
  sharePost,
  editComment,
  deleteComment,
} = require('../controllers/postController');

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getSuggestedFriends,
  removeFriend,
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
const uploadAvatar = require("../middleware/uploadAvatar");
const uploadStory = require("../middleware/uploadStory");
const upload = require("../middleware/uploadCloud");
const { getMessages } = require("../controllers/messageController");
const { createStory, getAllStories, getLatestStories, getMyStories, getFriendStories, deleteStory } = require("../controllers/storyController");
const uploadGroup = require("../middleware/uploadGroup");

const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);
router.get('/logout', Logout);
router.get('/me', authProtect, GetUser);
router.get('/user/:id', authProtect, GetUserById);
router.put('/user/update-info', authProtect, updateUserProfile);  //route cập nhật thông tin người dùng
router.post('/upload-avatar', authProtect, uploadAvatar, SetAvatar); // upload avatar
router.post('/upload-cover', authProtect, uploadAvatar, SetCoverPhoto); // upload ảnh bìa
router.post('/change-password', authProtect, changePassword); // đổi mật khẩu


router.get('/posts', authProtect, getAllPosts); // Lấy tất cả bài viết (công khai)
router.get('/posts/:id', getPostById); // Lấy bài viết theo ID (công khai)
router.get("/posts/user/:userId", getPostsByUserId);// Lấy bài viết theo ID (người dùng)
router.post('/posts', authProtect, upload, createPost); // Tạo bài viết (yêu cầu đăng nhập, sử dụng multer mới)
router.put('/posts/:id', authProtect, updatePost); // Cập nhật bài viết (yêu cầu đăng nhập)
router.delete('/posts/:id', authProtect, deletePost); // Xóa bài viết (yêu cầu đăng nhập)
router.post('/posts/:id/like', authProtect, toggleLikePost); // Thích/bỏ thích bài viết
router.post('/posts/:id/comment', authProtect, commentPost); // Bình luận bài viết
router.get("/posts/:id/likes", authProtect, GetLikePostById); //lấy danh sách like theo id bài viết
router.post('/comment/:postId/:commentId', authProtect, editComment); // sửa Bình luận bài viết
router.delete('/comment/:postId/:commentId', authProtect, deleteComment); // xóa Bình luận bài viết

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
router.get("/posts/share/:postId", getPostByIds);
router.post("/posts/:postId/share", authProtect, sharePost);

// Routes chức năng kết bạn
router.get("/all-friends", authProtect, GetFriends);
router.post("/send-friend-request", authProtect, sendFriendRequest);
router.post("/accept-friend-request", authProtect, acceptFriendRequest);
router.post("/reject-friend-request", authProtect, rejectFriendRequest);
router.get("/friend-requests", authProtect, getFriendRequests);
router.get("/suggested-friends", authProtect, getSuggestedFriends);
router.post("/remove-friend", authProtect, removeFriend);


router.post("/groups", authProtect, uploadGroup, createGroup);
router.get("/groups", getAllGroups);
router.get("/groups/:groupId", getGroupById);
router.post("/groups/:groupId/join", authProtect, joinGroup);
router.post("/groups/:groupId/leave", authProtect, leaveGroup);
router.post("/groups/:groupId/posts", authProtect, upload, createGroupPost);
router.delete("/groups/:groupId", authProtect, deleteGroup);

// story
// Route thêm story (yêu cầu đăng nhập)
// Tạo tin mới
router.post("/stories", authProtect, uploadStory, createStory);

// Lấy tất cả tin
router.get("/stories", getAllStories);
// Lấy tin của một user cụ thể
router.get("/stories/latest/:userId", getLatestStories);
router.get("/stories/me", authProtect, getMyStories);
router.get("/stories/friends", authProtect, getFriendStories);
router.delete("/stories/:storyId", authProtect, deleteStory);

// API nhắn tin
router.get("/api/messages", authProtect, async (req, res) => {
  const { senderId, receiverId } = req.query;
  console.log("📞 API /api/messages called with senderId:", senderId, "receiverId:", receiverId);
  try {
    const messages = await messageController.getMessages(senderId, receiverId);
    res.json(messages);
  } catch (err) {
    console.error("❌ API /api/messages error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;