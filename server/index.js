const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const router = require("./router/route");

const app = express();

app.use(cookieParser());
require("dotenv").config();

app.use(cors({
    origin : process.env.FONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", router);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to database", err);
});