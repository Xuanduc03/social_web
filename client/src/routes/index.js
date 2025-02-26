import Login from "~/pages/Login/Login";
import Profile from "~/pages/Profile/Profile";
import Register from "~/pages/Register/Register";


const { default: Chat } = require("~/pages/Chat/Chat");
const { default: Home } = require("~/pages/Home/Home");

const publicRoute = [
    {path: "/", component: Home},
    {path: "/chat", component: Chat},
    {path: "/profile", component: Profile},
    {path: "/regsiter", component: Register},
    {path: "/login", component: Login},
];

export default publicRoute;
