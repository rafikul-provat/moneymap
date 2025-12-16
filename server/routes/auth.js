import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed
    });

    res.json({ message: "User registered", userId: user._id });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      userId: user._id,          // REAL MongoDB ID
      username: user.username
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GOOGLE LOGIN / SIGNUP
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Extract user info
    const { email, name, picture } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        provider: "google",
        avatar: picture,
      });
    }

    // Create JWT
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


export default router;
