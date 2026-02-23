import express from "express";
import { createRequest, getRequests, updateStatus } from "../controllers/requestController.js";

const router = express.Router();

router.post("/", createRequest);
router.get("/", getRequests);
router.put("/:id", updateStatus);

export default router;
