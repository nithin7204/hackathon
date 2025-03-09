const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt.js")
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { EventEmitterAsyncResource } = require("nodemailer/lib/xoauth2/index.js");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nithinkumarkunchala@gmail.com',
    pass: 'meic klmt qpsu wmwb', // Consider using environment variables for security
  },
});

function generateOTP() {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
}

async function sendOTP(email, otp) {
    const mailOptions = {
      from: 'scriptedsage00@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('OTP email sent:', info.response);
    } catch (error) {
      console.error('Error sending OTP email:', error);
    }
  }
  
const otpStore = new Map();

function storeOTP(email, otp) {
  const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  otpStore.set(email, { otp, expiresAt });
}

function verifyOTP(email, enteredOtp) {
    const record = otpStore.get(email);
    if (!record) {
      return { success: false, message: 'No OTP found for this email.' };
    }
    const { otp, expiresAt } = record;
    if (Date.now() > expiresAt) {
      otpStore.delete(email);
      return { success: false, message: 'OTP has expired.' };
    }
    if (otp !== enteredOtp) {
      return { success: false, message: 'Invalid OTP.' };
    }
    otpStore.delete(email);
    return { success: true, message: 'OTP verified successfully.' };
  }
  
// Endpoint to request OTP
router.post('/signup/request-otp', async (req, res) => {
    const { email } = req.body;
    const otp = generateOTP();
    await sendOTP(email, otp);
    storeOTP(email, otp);
    res.status(200).send('OTP sent to your email.');
});
  
  // Endpoint to verify OTP
router.post('/signup/verify-otp', (req, res) => {
    const { email, user_otp } = req.body;
    const verificationResult = verifyOTP(email, user_otp);
    if (verificationResult.success) 
        {
      res.status(200).send('OTP verified successfully.');
    } else {
      res.status(400).send('OTP wrong');
    }
  });
  
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