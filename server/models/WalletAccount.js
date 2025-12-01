import mongoose from "mongoose";

const walletAccountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },       // Bank, bKash, Nagad, Rocket
    provider: { type: String, required: true },   // BRAC Bank, DBBL, bKash
    number: { type: String, required: true },
    balance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("WalletAccount", walletAccountSchema);
