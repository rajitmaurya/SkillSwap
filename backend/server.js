import express from "express";
import dotenv from "dotenv";
import AuthController from "./controllers/AuthController.js";
import SwapController from "./controllers/SwapController.js";
import UserController from "./controllers/UserController.js";
import connectDB from "./controllers/dbController.js";
import sendMail from "./controllers/MailController.js";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;
app.use(cors());

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