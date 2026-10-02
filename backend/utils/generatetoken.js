const jwt = require("jsonwebtoken");
console.log("JWT KEY =", process.env.JWT_KEY);

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_KEY
    );
};

module.exports = generateToken;