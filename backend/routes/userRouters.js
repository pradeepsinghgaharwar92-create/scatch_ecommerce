const express = require("express");
const router = express.Router();
const userModels = require("../models/user-models");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generatetoken");
const { loginUser } = require("../controllers/authcontroller");

const isLoggedin = require("../middlewares/isLoggedin");

router.get("/", (req, res) => {
    res.send("heyyyy");
});

router.post("/register", async (req, res) => {
    console.log("REGISTER REQUEST BODY:", req.body);

    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields"
            });
        }

        // Check if user already exists
        const existingUser = await userModels.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModels.create({
            fullname,
            email,
            password: hashedPassword,
        });

        console.log("USER CREATED:", user);

        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
        });

        return res.status(201).json({
            success: true,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                contact: user.contact,
                isadmin: user.isadmin || false
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});

router.post("/login", loginUser);

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

router.get("/me", isLoggedin, (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Not authenticated"
        });
    }
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            fullname: req.user.fullname,
            email: req.user.email,
            contact: req.user.contact,
            isadmin: req.user.isadmin || false
        }
    });
});

module.exports = router;