import express from "express";
import { mongo, mongoose } from "mongoose";
import bodyParser from "body-parser";

import dotenv from "dotenv";
import Recipe from "./models/Recipe.js";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies, headers)
  })
);
dbConnect();

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app.listen(port, () => {
  console.log(`Server running on port number ${port}`);
});
