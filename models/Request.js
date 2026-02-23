import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  offeredSkill: String,
  wantedSkill: String,
  status: { type: String, default: "pending" }
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);
