import express from "express";
import auth from "../middleware/auth.js";
import Account from "../models/Account.js";

const router = express.Router();

// GET total income, expense, and send to FE
router.get("/wallet", authMiddleware, async (req, res) => {
  try {
    const tx = await Transaction.find({ userId: req.user.userId });

    const totalIncome = tx
      .filter(t => t.type === "Income")
      .reduce((a,b) => a + b.amount, 0);

    const totalExpense = tx
      .filter(t => t.type === "Expense")
      .reduce((a,b) => a + b.amount, 0);

    res.json({
      totalIncome,
      totalExpense
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/wallet/accounts", authMiddleware, async (req, res) => {
  const accounts = await WalletAccount.find({ userId: req.user.userId });
  res.json(accounts);
});

export default router;
