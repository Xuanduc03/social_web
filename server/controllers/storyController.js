const User = require('../models/user')
const Story = require('../models/story');
const path = require('path'); // Thêm path để xử lý đường dẫn
const { getIo } = require('../socket/socket');
const cloudinary = require("cloudinary").v2;

// Tạo tin mới
module.exports.createStory = async (req, res) => {
    try {
        const { type, title, bgColor } = req.body;
        const userId = req.user.id; // Lấy ID người dùng từ token
        console.log("File nhận từ frontend:", type); 
        const media = [];
        if (req.file && type === "image") {

            console.log("File nhận từ frontend:", req.file); 

            media.push({
                url: req.file.path, // URL từ Cloudinary
                public_id: req.file.filename, // public_id từ Cloudinary
                type: req.file.mimetype.startsWith("video/") ? "video" : "image",
                duration: req.file.duration || null, // Nếu có video
            });
           
        }

        const storyData = {
            user: userId,
            type,
            title,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        if (type === "image" && media.length > 0) {
            storyData.media = media;
        } else if (type === "text") {
            storyData.bgColor = bgColor;
        }
        console.log("Media:",storyData); 

        const story = new Story(storyData);
        await story.save();
        console.log("Story đã lưu vào DB:", story);

        res.status(201).json({ success: true, data: story, message: "Đăng tin thành công" });
    } catch (error) {
        console.error("Lỗi tạo tin:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports.getAllStories = async (req, res) => {
    try {
        // Lấy danh sách story, sắp xếp mới nhất trước, kèm thông tin user
        const stories = await Story.find()
            .populate("user", "firstName lastName avatarImage") // Lấy thông tin người đăng
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        res.status(200).json({ success: true, data: stories });
    } catch (error) {
        console.error("Lỗi khi lấy tất cả story:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports.getUserStories = async (req, res) => {
    try {
        const userId = req.params.userId; // Lấy userId từ request
        const user = await User.findById(userId).populate("friends");

        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        const friendIds = user.friends.map(friend => friend._id);

        // Lấy story mới nhất của chính người dùng
        const myLatestStory = await Story.findOne({ user: userId })
            .populate("user", "firstName lastName avatarImage")
            .sort({ createdAt: -1 });

        // Lấy story mới nhất của mỗi bạn bè trong 24h qua
        const friendLatestStories = await Story.aggregate([
            { $match: { user: { $in: friendIds }, createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: "$user", latestStory: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$latestStory" } }
        ]);

        // Populate thông tin user cho story của bạn bè
        await Story.populate(friendLatestStories, { path: "user", select: "firstName lastName avatarImage" });

        res.json({
            success: true,
            data: { myLatestStory, friendLatestStories }
        });
    } catch (error) {
        console.error("Lỗi khi lấy story mới nhất:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};



module.exports.getMyStories = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy userId từ token đăng nhập

        const stories = await Story.find({ user: userId })
            .populate("user", "firstName lastName avatarImage")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: stories });
    } catch (error) {
        console.error("Lỗi khi lấy stories của người dùng:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// Lấy stories của bạn bè người dùng
module.exports.getFriendStories = async (req, res) => {
    try {
        const userId = req.user.id;

        // Lấy danh sách bạn bè của người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        const friendIds = user.friends; // Danh sách ID bạn bè

        // Lấy stories của bạn bè
        const stories = await Story.find(
            { user: { $in: friendIds } }
        )
            .populate("user", "firstName lastName avatarImage")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: stories });
    } catch (error) {
        console.error("Lỗi lấy story bạn bè:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

module.exports.getLatestStories = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kiểm tra user có tồn tại không
        const user = await User.findById(userId).populate("friends");
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        // Lấy danh sách bạn bè
        const friendIds = user.friends.map(friend => friend._id);

        // Lấy story mới nhất của chính user
        const myLatestStory = await Story.findOne({ user: userId })
            .populate("user", "firstName lastName avatarImage")
            .sort({ createdAt: -1 });

        // Lấy story mới nhất của mỗi bạn bè
        const friendLatestStories = await Story.aggregate([
            { $match: { user: { $in: friendIds }, createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } },
            { $sort: { createdAt: -1 } },
            { $group: { _id: "$user", latestStory: { $first: "$$ROOT" } } }
        ]);

        // Populate dữ liệu user cho từng story bạn bè
        const populatedFriendStories = await Story.populate(friendLatestStories.map(s => s.latestStory), {
            path: "user",
            select: "firstName lastName avatarImage"
        });

        res.status(200).json({
            success: true,
            data: {
                myLatestStory,
                friendLatestStories: populatedFriendStories
            }
        });
    } catch (error) {
        console.error("Lỗi khi lấy story mới nhất:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};


module.exports.deleteStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user.id;

        // Kiểm tra tin có tồn tại không
        const story = await Story.findOne({ _id: storyId, user: userId });
        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy tin hoặc bạn không có quyền xóa",
            });
        }

        // Xóa ảnh/video trên Cloudinary nếu có
        if (story.media && story.media.length > 0) {
            for (const item of story.media) {
                await cloudinary.uploader.destroy(item.public_id, {
                    resource_type: item.type === "video" ? "video" : "image",
                });
                console.log(`Đã xóa ${item.type} trên Cloudinary:`, item.public_id);
            }
        }

        // Xóa tin khỏi MongoDB
        await story.deleteOne();

        res.status(200).json({
            success: true,
            message: "Xóa tin thành công",
        });
    } catch (error) {
        console.error("Lỗi xóa tin:", error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi xóa tin",
        });
    }
};
