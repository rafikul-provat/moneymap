import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
<<<<<<< HEAD
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------
// REGISTER (EMAIL + PASSWORD)
// --------------------
=======

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// REGISTER
>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
    });

    // ✅ SEND WELCOME EMAIL
    await sendEmail({
      to: email,
      subject: "🎉 Welcome to Money Map",
      html: `
        <h2>Hello ${username},</h2>
        <p>Your Money Map account has been successfully created.</p>
        <p>If this was not you, please contact our support immediately.</p>
        <br/>
        <b>— Money Map Team</b>
      `,
    });

    res.json({ message: "User registered", userId: user._id });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// LOGIN
// --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< HEAD
// --------------------
// GOOGLE LOGIN / SIGNUP
// --------------------
=======
// GOOGLE LOGIN / SIGNUP
>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

<<<<<<< HEAD
=======
    // Verify Google ID token
>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

<<<<<<< HEAD
    const { email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ email });
    let isNewUser = false;
=======
    // Extract user info
    const { email, name, picture } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email });
>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca

    if (!user) {
      user = await User.create({
        username: name,
        email,
        provider: "google",
        avatar: picture,
      });
<<<<<<< HEAD
      isNewUser = true;
    }

    // ✅ SEND EMAIL ONLY IF NEW GOOGLE USER
    if (isNewUser) {
      await sendEmail({
        to: email,
        subject: "🎉 Welcome to Money Map (Google Sign-In)",
        html: `
          <h2>Hello ${name},</h2>
          <p>Your account was created using Google Sign-In.</p>
          <p>If this was not you, please secure your account immediately.</p>
          <br/>
          <b>— Money Map Security Team</b>
        `,
      });
    }

=======
    }

    // Create JWT
>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca
    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
});

<<<<<<< HEAD
=======

>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca
export default router;
