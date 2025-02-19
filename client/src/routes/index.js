const { default: Chat } = require("~/pages/Chat/Chat");
const { default: Home } = require("~/pages/Home/Home");

const publicRoute = [
    {path: "/", component: Home},
    {path: "/chat", component: Chat}
];

export default publicRoute;
