// server/routes/walletRoutes.js

import express from "express";
import authMiddleware from "../middleware/auth.js";
import Account from "../models/Account.js";

const router = express.Router();

/* ----------------------------------------------------
   GET ALL ACCOUNTS OF LOGGED-IN USER
---------------------------------------------------- */
router.get("/accounts", authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user.userId });
    res.json(accounts);
  } catch (err) {
    console.error("Load accounts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   ADD NEW ACCOUNT
---------------------------------------------------- */
router.post("/accounts", authMiddleware, async (req, res) => {
  try {
    const { type, provider, number, balance } = req.body;

    const acc = await Account.create({
      userId: req.user.userId,
      type,
      provider,
      number,
      balance,
    });

    res.json(acc);
  } catch (err) {
    console.error("Add account error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   UPDATE ACCOUNT
---------------------------------------------------- */
router.put("/accounts/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { type, provider, number, balance } = req.body;

    const acc = await Account.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { type, provider, number, balance },
      { new: true }
    );

    if (!acc) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json(acc);
  } catch (err) {
    console.error("Update account error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   DELETE ACCOUNT
---------------------------------------------------- */
router.delete("/accounts/:id", authMiddleware, async (req, res) => {
  try {
    const acc = await Account.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!acc) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ message: "Account deleted" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
