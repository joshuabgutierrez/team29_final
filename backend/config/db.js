const mongoose = require("mongoose");
const dotenv = require('dotenv');
const { mongodb_url } = require("./config");

dotenv.config();

async function connectDb() {
    try {
        const connection = await mongoose.connect(mongodb_url, {});
        console.log(`Connected to db successfully: ${connection.connection.host}`);
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDb;