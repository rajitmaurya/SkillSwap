import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
    {
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
        skillOffered: {
            type: String,
            required: true,
        },
        skillWanted: {
            type: String,
            required: true,
        },
        message: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "declined", "completed"],
            default: "pending",
        },
    },
    { timestamps: true },
);

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);

export default SwapRequest;
