const mongoose = require("mongoose");

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("connect to db");
    } catch (error) {
        console.log("can't connect to db")
    }
}

module.exports = connectDB;