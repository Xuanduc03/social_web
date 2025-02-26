const express = require("express");
const { Login, Register, Logout, GetUser } = require("../controllers/userController");
const { getAllPosts, getPostById, createPost, updatePost, deletePost, toggleLikePost, commentPost } = require("../controllers/postController");
const { authProtect } = require("../middleware/authProtect");


const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);
router.get('/logout', Logout);
router.get('/me',authProtect, GetUser);


router.get("/posts", getAllPosts);
router.get("/post/:id", getPostById);
router.post("/create-post", authProtect, createPost);
router.put("/update/:postId", authProtect, updatePost);
router.post("/delete/:postId", authProtect, deletePost);
router.put("/post/:postId/like", authProtect, toggleLikePost);
router.post("/post/:postId/comment", authProtect, commentPost);

module.exports = router;