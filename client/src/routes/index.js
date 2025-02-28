import Login from "~/pages/Login/Login";
import Profile from "~/pages/Profile/Profile";
import Register from "~/pages/Register/Register";
import Friend from "~/pages/Friend/Friend";

const { default: Chat } = require("~/pages/Chat/Chat");
const { default: Home } = require("~/pages/Home/Home");

const publicRoute = [
    {path: "/", component: Home},
    {path: "/chat", component: Chat},
    {path: "/profile", component: Profile},
    {path: "/register", component: Register},
    {path: "/login", component: Login},
    {path: "/friend", component: Friend},
];

export default publicRoute;
