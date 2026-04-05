import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import AuthController from "./controllers/AuthController.js";
import SwapController from "./controllers/SwapController.js";
import UserController from "./controllers/UserController.js";
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});