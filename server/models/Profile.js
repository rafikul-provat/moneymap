import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    monthlyBudget: {
      type: Number,
      required: true,
    },
    monthlyIncome: {
      type: Number,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;
