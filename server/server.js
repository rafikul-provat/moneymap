// ------------------------------
// GLOBAL CONFIG
// ------------------------------
process.env.TZ = "Asia/Dhaka";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";

// ROUTES
import authRoutes from "./routes/auth.js";
import transactionRoutes from "./routes/transactions.js";
import profileRoutes from "./routes/Profile.js";
import walletRoutes from "./routes/wallet.js";

dotenv.config();

const app = express();

// ------------------------------
// CORS CONFIG (IMPORTANT FOR HOSTING)
// ------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://moneymap-gnak.onrender.com"
    ],
    credentials: true,
  })
);

// ------------------------------
// MIDDLEWARE
// ------------------------------
app.use(express.json());

// ------------------------------
// CONNECT DATABASE
// ------------------------------
connectDB();

// ------------------------------
// ROUTES
// ------------------------------
app.use("/auth", authRoutes);
app.use("/transactions", transactionRoutes);
app.use("/profile", profileRoutes);
app.use("/wallet", walletRoutes);

// ------------------------------
// SERVER START
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
