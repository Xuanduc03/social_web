const Group = require("../models/group");
const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");
const { getIo } = require("../socket/socket");

// Tạo nhóm
module.exports.createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;
    const file = req.files?.images?.[0];

    if (!name) {
      return res.status(400).json({ message: "Tên nhóm là bắt buộc", success: false });
    }

    let coverImage = "https://via.placeholder.com/300x150";
    if (req.file) { 
      coverImage = req.file.path;
    }

    const newGroup = new Group({
      name,
      description,
      creator: userId,
      members: [{ user: userId }],
      coverImage: coverImage,
    });

    const savedGroup = await newGroup.save();
    await savedGroup.populate("creator", "firstName lastName avatarImage");

    res.status(201).json({
      data: savedGroup,
      message: "Tạo nhóm thành công",
      success: true,
    });
  } catch (error) {
    console.error("Create Group Error:", error);
    res.status(500).json({ message: "Lỗi server", success: false, error: error.message });
  }
};

// Lấy danh sách nhóm
module.exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("creator", "firstName lastName avatarImage")
      .select("name description coverImage members creator");

    res.status(200).json({
      data: groups,
      message: "Lấy danh sách nhóm thành công",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", success: false, error: error.message });
  }
};

// Lấy thông tin nhóm theo ID
module.exports.getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("creator", "firstName lastName avatarImage")
      .populate("members.user", "firstName lastName avatarImage")
      .populate({
        path: "posts",
        populate: { path: "user", select: "firstName lastName avatarImage" },
      });

    if (!group) {
      return res.status(404).json({ message: "Không tìm thấy nhóm", success: false });
    }

    res.status(200).json({
      data: group,
      message: "Lấy thông tin nhóm thành công",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", success: false, error: error.message });
  }
};

// Tham gia nhóm
module.exports.joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Không tìm thấy nhóm", success: false });
    }

    const isMember = group.members.some((member) => member.user.toString() === userId);
    if (isMember) {
      return res.status(400).json({ message: "Bạn đã là thành viên", success: false });
    }

    group.members.push({ user: userId });
    await group.save();

    res.status(200).json({ message: "Tham gia nhóm thành công", success: true });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", success: false, error: error.message });
  }
};

// Rời nhóm
module.exports.leaveGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id; // Lấy từ middleware authProtect

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Nhóm không tồn tại!" });
    }

    // Kiểm tra xem người dùng có phải là thành viên không
    const memberIndex = group.members.findIndex(
      (member) => member.user.toString() === userId
    );
    if (memberIndex === -1) {
      return res.status(400).json({ success: false, message: "Bạn không phải thành viên của nhóm này!" });
    }

    // Không cho phép người tạo nhóm rời khỏi
    if (group.creator.toString() === userId) {
      return res.status(403).json({ success: false, message: "Người tạo nhóm không thể rời nhóm!" });
    }

    // Xóa người dùng khỏi danh sách thành viên
    group.members.splice(memberIndex, 1);
    await group.save();

    return res.status(200).json({ success: true, message: "Bạn đã rời nhóm thành công!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Đăng bài trong nhóm
module.exports.createGroupPost = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;
    const files = req.files || [];
    
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Không tìm thấy nhóm", success: false });
    }

    const isMember = group.members.some((member) => member.user.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: "Bạn không phải thành viên của nhóm này", success: false });
    }

    if (!content && files.length === 0) {
      return res.status(400).json({ message: "Nội dung hoặc ảnh là bắt buộc", success: false });
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
      images: images,
      group: groupId, // Gắn bài viết với nhóm
    });

    const savedPost = await newPost.save();
    await savedPost.populate("user", "firstName lastName avatarImage");

    group.posts.push(savedPost._id);
    await group.save();

    res.status(201).json({
      data: savedPost,
      message: "Đăng bài trong nhóm thành công",
      success: true,
    });
  } catch (error) {
    console.error("Create Group Post Error:", error);
    res.status(500).json({ message: "Lỗi server", success: false });
  }
};

//Xóa nhóm
module.exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Bạn chưa đăng nhập",
        success: false,
        error: true,
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        message: "Không tìm thấy nhóm",
        success: false,
        error: true,
      });
    }

    // Chỉ người tạo nhóm mới có quyền xóa
    if (group.creator.toString() !== userId) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa nhóm này",
        success: false,
        error: true,
      });
    }

    await Group.deleteOne({ _id: groupId });

    res.status(200).json({
      message: "Xóa nhóm thành công",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Delete Group Error:", error);
    res.status(500).json({
      message: "Lỗi server khi xóa nhóm",
      success: false,
      error: true,
    });
  }
};