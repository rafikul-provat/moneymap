import express from "express";
import WalletAccount from "../models/WalletAccount.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// GET accounts
router.get("/accounts", authMiddleware, async (req, res) => {
  const accounts = await WalletAccount.find({ userId: req.user.userId });
  res.json(accounts);
});

// ADD account
router.post("/accounts", authMiddleware, async (req, res) => {
  const acc = await WalletAccount.create({
    userId: req.user.userId,
    ...req.body,
  });
  res.json(acc);
});

// UPDATE account
router.put("/accounts/:id", authMiddleware, async (req, res) => {
  const acc = await WalletAccount.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(acc);
});

// DELETE account
router.delete("/accounts/:id", authMiddleware, async (req, res) => {
  await WalletAccount.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
