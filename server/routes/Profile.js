import express from "express";
import Profile from "../models/Profile.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* -------------------------------------------------
   SAVE or UPDATE PROFILE
------------------------------------------------- */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { monthlyIncome, monthlyBudget, profession } = req.body;

    let profile = await Profile.findOne({ userId: req.user.userId });

    if (profile) {
      profile.monthlyIncome = monthlyIncome;
      profile.monthlyBudget = monthlyBudget;
      profile.profession = profession;
      await profile.save();
      return res.json(profile);
    }

    // First-time profile creation
    profile = await Profile.create({
      userId: req.user.userId,
      monthlyIncome,
      monthlyBudget,
      profession,
    });

    res.json(profile);
  } catch (err) {
    console.error("Profile save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------
   FETCH LOGGED-IN USER PROFILE (Correct route)
------------------------------------------------- */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    res.json(profile || null);
  } catch (err) {
    console.error("Profile load error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------------------------------
   FETCH PROFILE BY USER ID (optional)
------------------------------------------------- */
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    res.json(profile || null);
  } catch (err) {
    console.error("Profile load error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
