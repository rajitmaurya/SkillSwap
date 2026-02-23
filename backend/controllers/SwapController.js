import express from "express";
import jwt from "jsonwebtoken";
import SwapRequest from "../models/SwapRequest.js";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const SwapController = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// Create a new swap request
SwapController.post("/request", verifyToken, async (req, res) => {
    try {
        const { receiverId, skillOffered, skillWanted, message } = req.body;
        const senderId = req.user.id;

        if (senderId === receiverId) {
            return res.status(400).json({ message: "You cannot request a swap with yourself" });
        }

        const newRequest = new SwapRequest({
            sender: senderId,
            receiver: receiverId,
            skillOffered,
            skillWanted,
            message,
        });

        await newRequest.save();
        res.status(201).json({ message: "Swap request sent successfully", request: newRequest });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get requests for the logged-in user (both sent and received)
SwapController.get("/my-requests", verifyToken, async (req, res) => {
    try {
        const requests = await SwapRequest.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
            .populate("sender", "username email title avatar")
            .populate("receiver", "username email title avatar")
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update request status (accept/decline)
SwapController.put("/status/:requestId", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const request = await SwapRequest.findById(req.params.requestId);

        if (!request) return res.status(404).json({ message: "Request not found" });

        // Only the receiver can accept/decline
        if (request.receiver.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this request" });
        }

        request.status = status;
        await request.save();

        res.status(200).json({ message: `Request ${status} successfully`, request });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default SwapController;
