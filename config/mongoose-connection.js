const mongoose = require("mongoose");
require("dotenv").config();






mongoose.connect("mongodb://127.0.0.1:27017/scatch")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:");
    console.log(err);
});


setTimeout(() => {
    console.log("ReadyState After 3 Sec:", mongoose.connection.readyState);
}, 3000);

module.exports = mongoose.connection;
