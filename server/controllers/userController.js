const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.Register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const user = await User.findOne({email});

        if(user){
            throw new Error("User already exists");
        }

        // Kiểm tra nếu thiếu email, password hoặc name
        if (!email) {
            throw new Error("Please provide email");
        }
        if (!password) {
            throw new Error("Please provide password");
        }
        if (!username) {
            throw new Error("Please provide name");
        }

        //hash password
        const hashPassword = await bcrypt.hash(password, 10);
        if (!hashPassword) {
            throw new Error("Something went wrong with password hashing");
        }

        //create new user
        const payload = {
            ...req.body,
            password: hashPassword
        }
        const newUser = new User(payload);
        const saveUser = await newUser.save();

        res.status(200).json({
            data: saveUser,
            message: "Đăng ký thành công",
            success: true,
            error: false
        });
    } catch (error) {
        res.status(401).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
};

module.exports.Login = async (req, res) => {
    try {
        const {username, password} = req.body;

        if(!username) {
            throw new Error("please provide username");
        }

        if(!password) {
            throw new Error("please provide password");
        }

        const userData = await User.findOne({username});
        console.log(userData);
        if(!userData) {
            throw new Error("User has not account");
        }

        const checkPassword = await bcrypt.compare(password, userData.password);
        
        if(checkPassword){
            const tokenData = {
                _id : userData.id,
                username: userData.username
            };

            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {expiresIn: 60 * 60 * 8});

            const tokenOption ={
                httpOnly :true,
                secure: true
            };

            res.cookie("token", token, tokenOption).json({
                message: "Login Successful",
                success: true,
                error: false,
                data: token
            });
        }else {
            throw new Error("Invalid password");
        }
    } catch (error) {
        res.status(401).json({
            message: "Cann't login this account",
            success: false,
            error: true
        })
    }
};

module.exports.Logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true });
        res.json({
            message: "Logout Successful",
            success: true,
            error: false
        });
    } catch (error) {
        res.status(500).json({
            message: "Logout failed",
            success: false,
            error: true
        });
    }
};

module.exports.SetAvatar = async (req, res,next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;

        if(!avatarImage) {
            return res.status(401).json({message: "avatar image is required"});
        }

        const userData = await User.findByIdAndUpdate(
            userId, 
            {
            isAvatarImageSet: true,
            avatarImage,
        });

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        })
    } catch (error) {
        next(error);
    }
};

module.exports.GetAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({_id : {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]);
        return res.json(users);
    } catch (error) {
        next(error);
    }
}

module.exports.GetUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "user details"
        });
        
    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            success: false,
            error : true
        })
    }
}