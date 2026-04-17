import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import AuthController from "./controllers/AuthController.js";
import SwapController from "./controllers/SwapController.js";
import UserController from "./controllers/UserController.js";
import ChatController from "./controllers/ChatController.js";
import connectDB from "./controllers/dbController.js";
import sendMail from "./controllers/MailController.js";
import cors from "cors";
import session from "express-session";
import passport from "./passport.js";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173', 'https://skill-swap-henna-mu.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "skillswap_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//mongo connection
connectDB();

app.use("/api/auth", AuthController);
app.use("/api/users", UserController);
app.use("/api/swaps", SwapController);
app.use("/api/chat", ChatController);

app.get("/", (req, res) => {
  res.send("Hello World!");
});


import { createServer } from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private room.`);
  });

  socket.on("sendMessage", async ({ sender, receiver, text }) => {
    try {
      const newMessage = new Message({ sender, receiver, text });
      await newMessage.save();
      
      // Emit to receiver's room
      io.to(receiver).emit("receiveMessage", {
        sender,
        text,
        createdAt: newMessage.createdAt,
      });
      
      // Also emit back to sender (optional, but good for confirmation if not optimistic)
      io.to(sender).emit("receiveMessage", {
        sender,
        text,
        createdAt: newMessage.createdAt,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});