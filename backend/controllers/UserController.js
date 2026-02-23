import express from "express";
import User from "../models/User.js";

const UserController = express();

// Get all users (excluding sensitive info)
UserController.get("/", async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by id
UserController.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default UserController;
