// server/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: false },

    // ✅ ADD THESE (required for Google)
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
<<<<<<< HEAD

=======
>>>>>>> c56a79dcf3298de5d0121ced1b3136a56cccebca
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
