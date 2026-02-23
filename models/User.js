import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  skillsOffered: [String],
  skillsWanted: [String],
  bio: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);
