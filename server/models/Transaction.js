// models/Transaction.js

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  note: String,
  category: String,

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  date: {
    type: String,     // ⭐ CHANGE: store raw "YYYY-MM-DD"
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);
