const jwt = require("jsonwebtoken");
const userModels = require("../models/user-models");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        return res.status(401).json({
            success: false,
            message: "You need to login first"
        });
    }
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModels
            .findOne({ email: decoded.email })
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Session expired or invalid token"
        });
    }
};