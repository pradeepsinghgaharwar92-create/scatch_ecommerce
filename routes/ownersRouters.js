const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

// Create Owner/Admin
router.post("/create", async (req, res) => {
    try {
        const { fullname, gmail, password } = req.body;

        if (!fullname || !gmail || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingOwner = await ownerModel.findOne({ gmail });

        if (existingOwner) {
            return res.status(409).json({
                message: "Owner already exists",
            });
        }

        const createdOwner = await ownerModel.create({
            fullname,
            gmail,
            password,
        });

        res.status(201).json({
            message: "Owner created successfully",
            owner: createdOwner,
        });

    } catch (error) {
        console.error("Create owner error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
});

module.exports = router;