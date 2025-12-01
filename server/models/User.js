// server/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },            // display name
  email: { type: String, required: true, unique: true }, // login using email
  password: { type: String, required: true },            // hashed
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;
