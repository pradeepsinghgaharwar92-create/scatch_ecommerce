const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Error:");
        console.log(err);
    });

setTimeout(() => {
    console.log(
        "ReadyState After 3 Sec:",
        mongoose.connection.readyState
    );
}, 3000);

module.exports = mongoose.connection;