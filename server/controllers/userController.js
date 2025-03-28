const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports.Register = async (req, res) => {
    try {
        const { firstName, lastName, gender, birthday, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                error: true,
                success: false
            });
        }

        // Validate all required fields
        if (!email || !password || !firstName || !lastName || !gender || !birthday) {
            return res.status(400).json({
                message: "Please provide all required fields",
                error: true,
                success: false
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            gender,
            birthday,
            email,
            password: hashPassword
        });

        const savedUser = await newUser.save();
        
        return res.status(201).json({
            data: {
                id: savedUser._id,
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName
            },
            message: "Đăng ký thành công",
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: error.message || "Đã xảy ra lỗi khi đăng ký",
            error: true,
            success: false
        });
    }
};

module.exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password",
                error: true,
                success: false
            });
        }

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                error: true,
                success: false
            });
        }

        const tokenData = {
            _id: userData._id,
            email: userData.email
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { 
            expiresIn: "8h"
        });

        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        return res.cookie("token", token, tokenOption).json({
            message: "Login Successful",
            success: true,
            error: false,
            data: {
                token,
                user: {
                    id: userData._id,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName
                }
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: error.message || "An error occurred during login",
            success: false,
            error: true
        });
    }
};

module.exports.Logout = async (req, res) => {
    try {
        const tokenOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        res.clearCookie("token", tokenOption);
        return res.status(200).json({
            message: "Logout Successful",
            success: true,
            error: false
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Logout failed",
            success: false,
            error: true
        });
    }
};

module.exports.SetCoverPhoto = async (req, res) => {
    try {
      const userId = req.user?._id;
  
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: "Invalid user ID",
          success: false,
          error: true,
        });
      }
  
      if (!req.file) {
        return res.status(400).json({
          message: "Vui lòng upload file ảnh!",
          success: false,
          error: true,
        });
      }
  
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP!",
          success: false,
          error: true,
        });
      }
  
      const coverPhotoUrl = `http://localhost:8080/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        userId,
        { coverPhoto: coverPhotoUrl },
        { new: true, runValidators: true }
      );
  
      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng!",
          success: false,
          error: true,
        });
      }
  
      return res.status(200).json({
        data: { coverPhoto: user.coverPhoto },
        message: "Upload ảnh bìa thành công",
        success: true,
        error: false,
      });
    } catch (error) {
      console.error("SetCoverPhoto error:", error);
      return res.status(500).json({
        message: error.message || "Lỗi khi upload ảnh bìa",
        success: false,
        error: true,
      });
    }
  };

module.exports.SetAvatar = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID",
                success: false,
                error: true
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Please upload an image file",
                success: false,
                error: true
            });
        }

        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                message: "Invalid image format. Only JPG, PNG, WEBP allowed",
                success: false,
                error: true
            });
        }

        const avatarUrl = `http://localhost:8080/uploads/${req.file.filename}`; // Changed to relative path
        const user = await User.findByIdAndUpdate(
            userId,
            {
                avatarImage: avatarUrl,
                isAvatarImageSet: true
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            data: { avatar: user.avatarImage },
            message: "Avatar uploaded successfully",
            success: true,
            error: false
        });
    } catch (error) {
        console.error("SetAvatar error:", error);
        return res.status(500).json({
            message: error.message || "Error uploading avatar",
            success: false,
            error: true
        });
    }
};

module.exports.GetAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } })
            .select("email firstName lastName avatarImage _id")
            .lean();

        return res.status(200).json({
            data: users,
            success: true,
            error: false
        });
    } catch (error) {
        console.error("GetAllUsers error:", error);
        return res.status(500).json({
            message: error.message || "Error fetching users",
            success: false,
            error: true
        });
    }
};

module.exports.GetUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id)
            .select("-password")
            .lean();

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details retrieved successfully"
        });
    } catch (error) {
        console.error("GetUser error:", error);
        return res.status(500).json({
            message: error.message || "Error fetching user",
            success: false,
            error: true
        });
    }
};
module.exports.GetUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const userExisting = await User.findById(userId);

        if(!userExisting) {
            return res.status(400).json({
                message: "Người dùng ko tồn tại", success: false, error: true
            });
        }

        return res.status(200).json({
            data: userExisting,
            error: false,
            success: true,
            message: "User details retrieved successfully"
        });

    } catch (error) {
        console.error("GetUser error:", error);
        return res.status(500).json({
            message: error.message || "Error fetching user",
            success: false,
            error: true
        });
    }
}
//Friend
module.exports.GetFriends = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate("friends", "firstName lastName avatarImage");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user.friends);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
module.exports.sendFriendRequest = async (req, res) => {
    try {
      const { friendId } = req.body;
      const userId = req.user?._id;
  
      if (!friendId) return res.status(400).json({ message: "Vui lòng cung cấp ID người nhận", success: false });
      if (friendId === userId.toString()) return res.status(400).json({ message: "Không thể gửi lời mời cho chính mình", success: false });
  
      const friend = await User.findById(friendId);
      if (!friend) return res.status(404).json({ message: "Không tìm thấy người dùng", success: false });
  
      // Kiểm tra xem đã là bạn bè chưa
      if (friend.friends.includes(userId)) {
        return res.status(400).json({ message: "Hai người đã là bạn bè", success: false });
      }
  
      // Kiểm tra xem đã gửi lời mời chưa
      const existingRequest = friend.friendRequests.find((req) => req.user.toString() === userId.toString());
      if (existingRequest) return res.status(400).json({ message: "Đã gửi lời mời trước đó", success: false });
  
      friend.friendRequests.push({ user: userId });
      await friend.save();
  
      res.status(200).json({ message: "Đã gửi lời mời kết bạn", success: true });
    } catch (error) {
      console.error("Send Friend Request Error:", error);
      res.status(500).json({ message: "Lỗi server khi gửi lời mời", success: false });
    }
  };

module.exports.acceptFriendRequest = async (req, res) => {
    try {
      const { friendId } = req.body;
      const userId = req.user?._id;
  
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);
  
      if (!friend) return res.status(404).json({ message: "Không tìm thấy người dùng", success: false });
  
      const requestIndex = user.friendRequests.findIndex(
        (req) => req.user.toString() === friendId.toString() && req.status === "pending"
      );
      if (requestIndex === -1) return res.status(400).json({ message: "Không tìm thấy lời mời kết bạn", success: false });
  
      // Xóa lời mời sau khi chấp nhận
      user.friendRequests.splice(requestIndex, 1);
      user.friends.push(friendId);
      friend.friends.push(userId);
  
      await user.save();
      await friend.save();
  
      res.status(200).json({ message: "Đã chấp nhận lời mời kết bạn", success: true });
    } catch (error) {
      console.error("Accept Friend Request Error:", error);
      res.status(500).json({ message: "Lỗi server khi chấp nhận lời mời", success: false });
    }
  };

module.exports.rejectFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    const requestIndex = user.friendRequests.findIndex((req) => req.user.toString() === friendId.toString() && req.status === "pending");

    if (requestIndex === -1) return res.status(400).json({ message: "Không tìm thấy lời mời kết bạn", success: false });

    user.friendRequests.splice(requestIndex, 1);
    await user.save();

    res.status(200).json({ message: "Đã xóa lời mời kết bạn", success: true });
  } catch (error) {
    console.error("Reject Friend Request Error:", error);
    res.status(500).json({ message: "Lỗi server khi xóa lời mời", success: false });
  }
};

module.exports.getFriendRequests = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId)
      .populate("friendRequests.user", "firstName lastName avatarImage")
      .lean();

    const friendRequests = user.friendRequests.filter((req) => req.status === "pending");
    res.status(200).json({ data: friendRequests, success: true });
  } catch (error) {
    console.error("Get Friend Requests Error:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách lời mời", success: false });
  }
};

module.exports.getSuggestedFriends = async (req, res) => {
    try {
      const userId = req.user?._id;
      const user = await User.findById(userId);
      const friends = user.friends.map((f) => f.toString());
  
      // Lấy danh sách những người chưa là bạn bè và không nhận lời mời từ user hiện tại
      const suggestedFriends = await User.find({
        _id: { $nin: [userId, ...friends] }, // Loại trừ User hiện tại và bạn bè hiện tại
        "friendRequests.user": { $ne: userId }, // Loại trừ những người đã nhận lời mời từ User hiện tại
        friends: { $ne: userId }, // Loại trừ những người đã có User hiện tại trong danh sách bạn bè
      })
        .select("firstName lastName avatarImage")
        .limit(6)
        .lean();
  
      // Tính số bạn chung (mutual friends)
      const suggestedWithMutual = await Promise.all(
        suggestedFriends.map(async (friend) => {
          const mutualFriends = await User.countDocuments({
            _id: friend._id,
            friends: { $in: user.friends },
          });
          return { ...friend, mutualFriends };
        })
      );
  
      res.status(200).json({ data: suggestedWithMutual, success: true });
    } catch (error) {
      console.error("Get Suggested Friends Error:", error);
      res.status(500).json({ message: "Lỗi server khi lấy danh sách gợi ý", success: false });
    }
  };

  //   Gợi ý bạn bè theo tên (dành cho popup gợi ý)
  exports.searchFriends = async (req, res) => {
    try {
        const { query, userId } = req.query;

        if (!query || !userId) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu tìm kiếm" });
        }

        // Lấy danh sách bạn bè của userId
        const user = await User.findById(userId).populate("friends");

        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        // Lọc danh sách bạn bè có tên khớp với query
        const matchedFriends = user.friends.filter(friend =>
            (`${friend.firstName} ${friend.lastName}`).toLowerCase().includes(query.toLowerCase())
        );

        res.json({ success: true, data: matchedFriends });
    } catch (error) {
        console.error("Lỗi tìm kiếm bạn bè:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

//   Tìm kiếm toàn bộ người dùng khi nhấn Enter
// exports.searchUsers = async (req, res) => {
//     try {
//         const { query, userId } = req.query;

//         // Kiểm tra nếu không có userId (để tránh lỗi)
//         if (!userId) {
//             return res.status(400).json({ success: false, message: "Thiếu userId" });
//         }

//         // Lấy thông tin user hiện tại và populate danh sách bạn bè
//         const user = await User.findById(userId)
//             .populate("friends")
//             .populate("friendRequests.user");

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User không tồn tại" });
//         }

//         // Tạo Set để kiểm tra nhanh trạng thái bạn bè và lời mời kết bạn
//         const friendsSet = new Set(user.friends.map(f => f._id.toString()));
//         const pendingRequestsSet = new Set(
//             user.friendRequests
//                 .filter(r => r.status === "pending")
//                 .map(r => r.user._id.toString())
//         );

//         // Điều kiện tìm kiếm (nếu có query thì tìm theo tên, không có thì lấy tất cả)
//         const searchCondition = query
//             ? {
//                   _id: { $ne: userId }, // Không lấy user hiện tại
//                   $or: [
//                       { firstName: { $regex: query, $options: "i" } },
//                       { lastName: { $regex: query, $options: "i" } }
//                   ]
//               }
//             : { _id: { $ne: userId } }; // Nếu không có query, lấy tất cả người dùng trừ chính mình

//         // Tìm kiếm người dùng phù hợp với điều kiện
//         const users = await User.find(searchCondition).select("firstName lastName avatarImage");

//         // Định dạng dữ liệu trả về
//         const formattedUsers = users.map((u) => {
//             const userIdStr = u._id.toString();
//             let status = "none"; // Mặc định chưa kết bạn

//             if (friendsSet.has(userIdStr)) {
//                 status = "friend"; // Đã là bạn bè
//             } else if (pendingRequestsSet.has(userIdStr)) {
//                 status = "pending"; // Đã gửi lời mời kết bạn
//             }

//             return {
//                 _id: u._id,
//                 firstName: u.firstName,
//                 lastName: u.lastName,
//                 avatarImage: u.avatarImage,
//                 status
//             };
//         });

//         // Trả về danh sách người dùng với trạng thái chính xác
//         res.status(200).json({ success: true, data: formattedUsers });
//     } catch (error) {
//         console.error("Lỗi tìm kiếm người dùng:", error);
//         res.status(500).json({ success: false, message: "Lỗi server khi tìm kiếm người dùng" });
//     }
// };

exports.searchUsers = async (req, res) => {
    try {
        const { query, userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: "Thiếu userId" });
        }

        // Lấy thông tin user hiện tại để kiểm tra bạn bè
        const user = await User.findById(userId).populate("friends");

        if (!user) {
            return res.status(404).json({ success: false, message: "User không tồn tại" });
        }

        const friendsSet = new Set(user.friends.map(f => f._id.toString()));

        // Điều kiện tìm kiếm
        const searchCondition = query
            ? {
                _id: { $ne: userId }, 
                $or: [
                    { firstName: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" } }
                ]
            }
            : { _id: { $ne: userId } };

        // Tìm người dùng
        const users = await User.find(searchCondition)
            .select("firstName lastName avatarImage friendRequests");

        // Kiểm tra trạng thái kết bạn
        const formattedUsers = users.map((u) => {
            const userIdStr = u._id.toString();
            let status = "none";

            if (friendsSet.has(userIdStr)) {
                status = "friend";
            } else {
                // Kiểm tra trong friendRequests
                const request = u.friendRequests.find(req => req.user.toString() === userId);
                if (request && request.status === "pending") {
                    status = "pending"; // Đã gửi lời mời
                }
            }

            return {
                _id: u._id,
                firstName: u.firstName,
                lastName: u.lastName,
                avatarImage: u.avatarImage,
                status
            };
        });

        res.status(200).json({ success: true, data: formattedUsers });
    } catch (error) {
        console.error("Lỗi tìm kiếm người dùng:", error);
        res.status(500).json({ success: false, message: "Lỗi server khi tìm kiếm người dùng" });
    }
};
//hủy lời mời ở search
exports.cancelFriendRequest = async (req, res) => {
    try {
        const { userId, friendId } = req.body;
        if (!userId || !friendId) {
            return res.status(400).json({ success: false, message: "Thiếu userId hoặc friendId" });
        }

        // Tìm user nhận lời mời
        const friend = await User.findById(friendId);
        if (!friend) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        // Xóa lời mời kết bạn của userId trong danh sách friendRequests của friendId
        const updatedRequests = friend.friendRequests.filter(req => req.user.toString() !== userId);

        // Kiểm tra xem có lời mời nào được xóa hay không
        if (updatedRequests.length === friend.friendRequests.length) {
            return res.status(400).json({ success: false, message: "Không tìm thấy lời mời kết bạn để hủy" });
        }

        // Cập nhật danh sách lời mời kết bạn
        friend.friendRequests = updatedRequests;
        await friend.save();

        res.status(200).json({ success: true, message: "Đã hủy lời mời kết bạn" });
    } catch (error) {
        console.error("Lỗi khi hủy lời mời kết bạn:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
