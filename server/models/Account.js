import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: String,        // Bank / bKash / Nagad / Rocket
  provider: String,    // BRAC / DBBL / etc.
  number: String,
  balance: Number,
});

export default mongoose.model("Account", accountSchema);