import UpComment from "~/components/Popper/UpComment/UpComment";
import Friend from "~/pages/Friend/Friend";
import Login from "~/pages/Login/Login";
import Profile from "~/pages/Profile/Profile";
import Register from "~/pages/Register/Register";


const { default: Chat } = require("~/pages/Chat/Chat");
const { default: Home } = require("~/pages/Home/Home");

const publicRoute = [
    {path: "/", component: Home},
    {path: "/chat", component: Chat},
    {path: "/profile/:userId", component: Profile},
    {path: "/register", component: Register},
    {path: "/login", component: Login},
    {path: "/friend", component: Friend},
    {path: "/post/:postId/comments", component: UpComment}
];

export default publicRoute;

