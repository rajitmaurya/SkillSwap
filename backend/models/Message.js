import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "swap_request"],
    default: "text",
  },
  swapRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SwapRequest",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
