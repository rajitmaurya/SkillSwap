import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Get messages between two users
router.get("/history/:userId/:otherUserId", async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .populate("swapRequest")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Get all users who have chatted with the current user
router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).populate("sender receiver", "username avatar");

    const users = new Map();
    messages.forEach((msg) => {
      const otherUser = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
      if (otherUser) {
          const uObj = otherUser.toObject ? otherUser.toObject() : { ...otherUser };
          uObj.name = uObj.username;
          uObj.profileImage = uObj.avatar;
          users.set(otherUser._id.toString(), uObj);
      }
    });

    res.json(Array.from(users.values()));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

export default router;
