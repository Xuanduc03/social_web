const Post = require("../models/post");

// Lấy tất cả bài viết
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name avatar")
            .populate("comments.user", "name avatar")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "name avatar")
            .populate("comments.user", "name avatar");

        if (!post) {
            return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
        }

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


//create post controller
exports.createPost = async (req, res) => {
    try {
        const { content, images } = req.body;
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
        }
        const newPost = new Post({
            user: req.user._id,
            content,
            images,
        });

        await newPost.save();
        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.updatePost = async (req, res) => {
    try {
        const { content, images } = req.body;
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền chỉnh sửa bài viết này" });
        }

        post.content = content || post.content;
        post.images = images || post.images;
        await post.save();

        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
        }

        if (post.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền xóa bài viết này" });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: "Đã xóa bài viết thành công" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



exports.toggleLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id; // Lấy từ middleware bảo vệ

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
        }

        // Kiểm tra nếu user đã like trước đó
        const likedIndex = post.likes.indexOf(userId);
        if (likedIndex === -1) {
            post.likes.push(userId); // Like
            await post.save();
            return res.status(200).json({ success: true, message: "Đã like bài viết" });
        } else {
            post.likes.splice(likedIndex, 1); // Unlike
            await post.save();
            return res.status(200).json({ success: true, message: "Đã bỏ like bài viết" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    };; l;
};



exports.commentPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
        }

        const newComment = {
            user: userId,
            text,
            createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ success: true, message: "Đã bình luận", data: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
