import express from "express";
import {
  insertrecipe,
  searchrecipe,
  generatedRecipes,
  chat,
} from "../controllers/recipeController.js";
import verifyToken from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/search", verifyToken, searchrecipe);
router.post("/insert", verifyToken, insertrecipe);
router.post("/generate", verifyToken, generatedRecipes);
router.post("/chat", verifyToken, chat);

export default router;
