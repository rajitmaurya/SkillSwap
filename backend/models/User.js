import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true,
  },
  title: {
    type: String,
    default: "Member",
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/150",
  },
  skillsOffered: {
    type: [String],
    default: [],
  },
  skillsWanted: {
    type: [String],
    default: [],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});
const User = mongoose.model("User", userSchema);

export default User;