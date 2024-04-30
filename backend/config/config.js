require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongodb_url: process.env.MONGO_URL
};