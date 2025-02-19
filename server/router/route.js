const express = require("express");
const { Login, Register, Logout } = require("../controllers/userController");

const router = express.Router();

router.post('/login', Login);
router.post('/register', Register);
router.get('/logout', Logout);

module.exports = router;