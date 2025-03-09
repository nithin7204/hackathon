const express = require("express");
const router = express.Router();
const User = require("../models/User"); // ✅ Import the User model
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt.js")

router.post("/signup", async (req, res) => {
    try {
        const { username, password, email, mobile } = req.body;

        const findUser = await User.findOne({ email });

        if (findUser) {
            return res.status(400).json({ "Message": "User already with the username" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword, email, mobile });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email });

    // console.log(username)

    if (!user) {
        return res.status(404).json({ "message": "user not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(400).json({ "message": "incorrect password" })
    }

    const token = generateToken(user)
    res.status(200).json({ "message": "Logged in successfully", token })
})

router.post("/reset-password", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });

        // console.log(username)

        if (!user) {
            return res.status(404).json({ "message": "user not found" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword
        await user.save();

        const token = generateToken(user)
        res.status(200).json({ "message": "Password Reset Successfully", token })
    }
    catch(err)
    {
        console.log("Error",err)
        res.status(500).json({"message" : "Internal server error"})
    }
})

module.exports = router