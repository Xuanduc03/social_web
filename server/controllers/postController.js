const Post = require('../models/post');
const User = require('../models/user')
const mongoose = require('mongoose');
const path = require('path'); // Thêm path để xử lý đường dẫn
const { getIo } = require('../socket/socket');
const cloudinary = require("cloudinary").v2;

// Tạo bài viết
module.exports.createPost = async (req, res) => {
  try {
    const { content } = req.body; // Lấy content từ req.body (đã parse bởi multer)
    const userId = req.user?.id; // Lấy từ middleware authProtect
    const files = req.files || []; // Lấy danh sách file ảnh từ req.files

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Nội dung bài viết là bắt buộc",
        success: false,
        error: true,
      });
    }

    if (files.length > 4) {
      return res.status(400).json({
        message: "Chỉ được upload tối đa 4 ảnh",
        success: false,
        error: true,
      });
    }

    let images = [];
    if (files.length > 0) {
      images = files.map(file => {
        if (!file.path || !file.filename) {
          throw new Error("File upload failed: Missing path or filename");
        }
        return {
          url: file.path,
          public_id: file.filename,
        };
      });
    }

    const newPost = new Post({
      user: userId,
      content: content.trim(),
      images: images
    });


    const savedPost = await newPost.save();
    await savedPost.populate('user', 'firstName lastName avatar');

    // emit create post on socket io
    const io = getIo();
    io.emit("newPost", savedPost); // Gửi bài viết mới đến tất cả client
    io.to(userId).emit("notification", {
      message: "Bạn đã đăng bài viết thành công!",
      postId: savedPost._id,
      createdAt: savedPost.createdAt,
    });
    
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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    // lấy page và limit từ query, mặc định page = 1 và limmit 10
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1 ) * limit;


    // Lấy thông tin user hiện tại để lấy danh sách bạn bè
    const currentUser = await User.findById(userId).select("friends");
    const friendIds = currentUser.friends.map(friend => friend.toString());

    // Thêm userId vào danh sách để bao gồm cả bài viết của chính mình
    const visibleUserIds = [userId, ...friendIds];

    const totalPost = await Post.countDocuments({
      user: { $in: visibleUserIds},
      group: null // Chỉ lấy bài viết không thuộc nhóm
    });

    // Lấy bài viết chỉ từ chính user và bạn bè, không bao gồm bài viết trong nhóm
    const posts = await Post.find({
      user: { $in: visibleUserIds },
      group: null // Chỉ lấy bài viết không thuộc nhóm
    })
      .populate('user', 'firstName lastName avatarImage')
      .populate('comments.user', 'firstName lastName avatar')
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: posts,
      currentPage: page,  
      totalPages: Math.ceil(totalPost / limit), // Tổng số trang
      totalPost,
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

    // 📌 Lấy danh sách public_id từ post.images[]
    const publicIds = post.images.map((image) => image.public_id);

    // 📌 Xóa tất cả ảnh trên Cloudinary nếu có ảnh
    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds, {
        type: "upload",
        resource_type: "image",
      });
      console.log("🗑️ Đã xóa ảnh trên Cloudinary:", publicIds);
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

module.exports.sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body; // Nội dung người dùng nhập khi chia sẻ
    const userId = req.user.id;

    // Kiểm tra bài viết gốc có tồn tại không
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
    }

    // Tạo bài viết chia sẻ
    const newPost = new Post({
      user: userId,
      content, // Nội dung của bài chia sẻ
      sharedPost: originalPost._id, // Lưu ID bài viết gốc
    });

    await newPost.save();

    // Cập nhật danh sách người chia sẻ trong bài viết gốc
    await Post.findByIdAndUpdate(postId, {
      $push: { shares: { user: userId } },
    });

    res.status(201).json({ success: true, message: "Đã chia sẻ bài viết!", newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// Lấy thông tin bài viết, nếu có sharedPost thì lấy luôn bài gốc
module.exports.getPostByIds = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("user", "firstName lastName avatarImage") // Lấy thông tin người đăng
      .populate({
        path: "sharedPost",
        populate: { path: "user", select: "firstName lastName avatarImage " }, // Lấy thông tin bài viết gốc
      });

    if (!post) {
      return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
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
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    await updatedPost.populate("user", "firstName lastName avatar");

    const io = getIo();

    // Gửi cập nhật số lượt thích đến tất cả client
    io.emit(`updateLikes:${postId}`, {
      postId,
      likes: updatedPost.likes,
      liked: updatedPost.likes.includes(userId),
    });

    // Gửi thông báo tới chủ bài viết nếu là hành động "like"
    if (!liked && post.user.toString() !== userId) {
      const liker = await User.findById(userId).select("firstName lastName");

      io.to(post.user.toString()).emit("likeNoti", {
        message: `${liker.firstName} ${liker.lastName} đã thích bài viết của bạn.`,
        postId: post._id,
        createdAt: new Date(),
      });

      console.log(`📣 Sent 'notification' to Post Owner ${post.user.toString()} from ${liker.firstName} ${liker.lastName}`);
    }

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


// Lấy danh sách like bài viết theo id bài viết 
module.exports.GetLikePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).select("likes");
    if (!post) {
      return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
    }
    res.json({
      success: true,
      data: {
        likes: post.likes,
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy lượt thích:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Lấy danh sách like bài viết theo id bài viết 
module.exports.GetPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId).select('comments'); // Chỉ lấy trường likes
    if (!post) {
      return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
    }
    res.json({ success: true, comments: post.comments });
  } catch (error) {
    console.error('Lỗi khi lấy lượt thích:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
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

    // Emit sự kiện updateComments
    const io = getIo();
    io.emit(`updateComments:${postId}`, { comments: post.comments });

    // Emit sự kiện newComment
    const commenter = await User.findById(userId).select("firstName lastName avatarImage");
    io.to(post.user.toString()).emit("newComment", {
      postId: postId,
      commenter,
      commentText: text,
    });

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

// sửa bình luận
module.exports.editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập", success: false });
    }
    if (!text) {
      return res.status(400).json({ message: "Nội dung bình luận không được để trống", success: false });
    }
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "ID không hợp lệ", success: false });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại", success: false });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại", success: false });
    }
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền sửa bình luận này", success: false });
    }

    // Cập nhật nội dung bình luận
    comment.text = text;
    await post.save();

    // Emit sự kiện cập nhật bình luận
    const io = getIo();
    io.emit(`updateComments:${postId}`, { comments: post.comments });

    res.status(200).json({ message: "Chỉnh sửa bình luận thành công", success: true, data: post.comments });
  } catch (error) {
    console.error("Edit Comment Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi sửa bình luận",
      success: false,
      error: true,
    });
  }
}

//xóa bình luận
module.exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập", success: false });
    }
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "ID không hợp lệ", success: false });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại", success: false });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại", success: false });
    }

    // Chỉ cho phép xóa nếu là chủ bài viết hoặc chủ bình luận
    if (comment.user.toString() !== userId.toString() && post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này", success: false });
    }

    // Xóa bình luận
    comment.deleteOne();
    await post.save();

    // Emit sự kiện xóa bình luận
    const io = getIo();
    io.emit(`updateComments:${postId}`, { comments: post.comments });

    res.status(200).json({ message: "Xóa bình luận thành công", success: true });
  } catch (error) {
    console.error("Delete Comment Error:", error);
    res.status(500).json({ message: "Lỗi server khi xóa bình luận", success: false });
  }
};


//lấy id bài viết theo người dùng
module.exports.getPostsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Kiểm tra xem userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "ID người dùng không hợp lệ",
        success: false,
        error: true,
      });
    }

    // Tìm tất cả bài viết của user theo userId, sắp xếp theo thời gian mới nhất
    const posts = await Post.find({ user: userId })
      .populate("user", "firstName lastName avatarImage") // Lấy thông tin người tạo bài viết
      .populate("comments.user", "firstName lastName avatarImage") // Lấy thông tin người bình luận
      .sort({ createdAt: -1 }); // Sắp xếp bài viết mới nhất trước

    res.status(200).json({
      data: posts,
      message: "Lấy danh sách bài viết của người dùng thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Get User Posts Error:", error);
    res.status(500).json({
      message: error.message || "Lỗi server khi lấy bài viết",
      success: false,
      error: true,
    });
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    const post = await Post.findById(postId).populate("group");
    if (!post) {
      return res.status(404).json({ message: "Không tìm thấy bài viết", success: false });
    }

    // Nếu bài viết thuộc nhóm, kiểm tra thành viên
    if (post.group) {
      const group = await Group.findById(post.group);
      const isMember = group.members.some((member) => member.user.toString() === userId);
      if (!isMember) {
        return res.status(403).json({ message: "Bạn không phải thành viên của nhóm này", success: false });
      }
    }

    const newComment = { user: userId, text };
    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate("comments.user", "firstName lastName avatarImage");
    const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

    res.status(201).json({
      data: addedComment,
      message: "Bình luận thành công",
      success: true,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);
    res.status(500).json({ message: "Lỗi server", success: false, error: error.message });
  }
};
