const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const router = require("./router/route");

const app = express();
require("dotenv").config();

app.use(cors({
    origin : process.env.FONTEND_URL,
    credentials: true 
}));

app.use(express.json());

app.use("/api", router);



connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.error("Failed to connect to database", err);
});