import express from "express";
import Transaction from "../models/Transaction.js";
import authMiddleware from "../middleware/auth.js";
import { sendEmail } from "../utils/sendEmail.js";
import User from "../models/User.js";

const router = express.Router(); // ✅ THIS LINE WAS MISSING

// ===============================
// ⚠️ UNUSUAL TRANSACTION THRESHOLD
// ===============================
const UNUSUAL_AMOUNT = 20000;


// ------------------------------
// ADD TRANSACTION
// ------------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, note, category, date } = req.body;

    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Save transaction
    const tx = await Transaction.create({
      userId: req.user.userId,
      title,
      amount,
      type,
      note,
      category,
      date,
    });

    // ===============================
    // ⚠️ UNUSUAL TRANSACTION EMAIL
    // ===============================
   if (
  type?.toLowerCase() === "expense" &&
  Number(amount) >= UNUSUAL_AMOUNT
) {
  console.log("⚠️ Unusual expense detected:", amount);

  const user = await User.findById(req.user.userId);

  if (user?.email) {
    try {
      await sendEmail({
        to: user.email,
        subject: "⚠️ Unusual Transaction Alert - Money Map",
        html: `
          <h2>Security Alert</h2>
          <p>An unusual expense was detected on your Money Map account.</p>
          <p><b>Amount:</b> ${amount} BDT</p>
          <p><b>Threshold:</b> ${UNUSUAL_AMOUNT} BDT</p>
          <p><b>Category:</b> ${category || "N/A"}</p>
          <p><b>Date:</b> ${date}</p>
          <br/>
          <p>If this was NOT you, please change your password immediately.</p>
          <br/>
          <b>— Money Map Security Team</b>
        `,
      });

      console.log("📧 Unusual expense email sent");
    } catch (err) {
      console.error("❌ Alert email failed:", err.message);
    }
  }
}

    res.json(tx);
  } catch (err) {
    console.error("POST Transaction Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/monthly/:year/:month", authMiddleware, async (req, res) => {
  try {
    const { year, month } = req.params;

    // Create start & end of the month
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = `${year}-${String(month).padStart(2, "0")}-31`;

    // ⭐ Only load transactions inside this month
    const txList = await Transaction.find({
      userId: req.user.userId,
      date: { $gte: startDate, $lte: endDate }
    });

    const days = new Date(year, month, 0).getDate();
    let monthly = {};

    // Build empty days
    for (let d = 1; d <= days; d++) {
      const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      monthly[key] = { income: 0, expense: 0 };
    }

    // Add daily totals
    txList.forEach((tx) => {
      const key = tx.date;
      if (!monthly[key]) return;

      if (tx.type === "Income") monthly[key].income += tx.amount;
      else monthly[key].expense += tx.amount;
    });

    // Convert to cumulative totals
    let cumIncome = 0;
    let cumExpense = 0;

    Object.keys(monthly).forEach((date) => {
      cumIncome += monthly[date].income;
      cumExpense += monthly[date].expense;
      monthly[date].income = cumIncome;
      monthly[date].expense = cumExpense;
    });

    res.json(monthly);

  } catch (err) {
    console.error("Monthly Load Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------
// MONTHLY REPORT (FINAL WORKING VERSION)
// -----------------------------------------
router.get("/yearly-summary", authMiddleware, async (req, res) => {
  try {
    const year = req.query.year;
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;

    const tx = await Transaction.find({
      userId: req.user.userId,
      date: { $gte: start, $lte: end }
    });

    const totalIncome = tx
      .filter(t => t.type === "Income")
      .reduce((a, b) => a + b.amount, 0);

    const totalExpense = tx
      .filter(t => t.type === "Expense")
      .reduce((a, b) => a + b.amount, 0);

    res.json({ totalIncome, totalExpense });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/monthly-report", authMiddleware, async (req, res) => {
  try {
    const { month } = req.query; // "YYYY-MM"
    const userId = req.user.userId;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Invalid month format" });
    }

    const [year, mm] = month.split("-");
    const startDate = `${year}-${mm}-01`;

    // Get last day of month
    const lastDay = new Date(year, Number(mm), 0).getDate();
    const endDate = `${year}-${mm}-${String(lastDay).padStart(2, "0")}`;

    // Fetch all transactions inside this month
    const txList = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // SUMMARY
    const totalIncome = txList
      .filter(t => t.type === "Income")
      .reduce((a, b) => a + b.amount, 0);

    const totalExpense = txList
      .filter(t => t.type === "Expense")
      .reduce((a, b) => a + b.amount, 0);

    const wallet = totalIncome - totalExpense;
    const tax = Math.round(totalIncome * 0.05);

    // CATEGORY BREAKDOWN
    const categoryMap = {};
    txList.forEach(t => {
      if (t.type === "Expense") {
        const cat = t.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + t.amount;
      }
    });

    const categoryBreakdown = Object.keys(categoryMap).map(k => ({
      category: k,
      value: categoryMap[k]
    }));

    // RESPONSE
    res.json({
      transactions: txList,
      totalIncome,
      totalExpense,
      tax,
      wallet,
      categoryBreakdown
    });

  } catch (err) {
    console.error("Monthly report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/wallet/accounts", authMiddleware, async (req, res) => {
  const accounts = await WalletAccount.find({ userId: req.user.userId });
  res.json(accounts);
});
// ===============================
// WALLET SUMMARY ROUTE
// ===============================
router.get("/wallet/summary", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const tx = await Transaction.find({ userId });

    let totalIncome = 0;
    let totalExpense = 0;

    tx.forEach(t => {
      if (t.type === "Income") totalIncome += t.amount;
      if (t.type === "Expense") totalExpense += t.amount;
    });

    res.json({
      totalIncome,
      totalExpense,
      wallet: totalIncome - totalExpense
    });

  } catch (err) {
    console.error("Wallet Load Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ------------------------------
// GET USER TRANSACTIONS
// ------------------------------
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const tx = await Transaction.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(tx);
  } catch (err) {
    console.error("GET Transactions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const tx = await Transaction.findById(id);

    if (!tx) return res.status(404).json({ msg: "Transaction not found" });

    // ensure logged-in user owns it
    if (tx.userId.toString() !== req.user.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await tx.deleteOne();
    res.json({ msg: "Transaction deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to delete" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const tx = await Transaction.findById(id);

    if (!tx) return res.status(404).json({ msg: "Transaction not found" });

    // ensure logged-in user owns it
    if (tx.userId.toString() !== req.user.userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await tx.deleteOne();
    res.json({ msg: "Transaction deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to delete" });
  }
});

export default router;
