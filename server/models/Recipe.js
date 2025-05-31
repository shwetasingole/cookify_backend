import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assumes your User model is named 'User'
      required: true,
    },
    title: { type: String },
    time: String,
    servings: String,
    calories: String,
    mealType: String,
    dietType: String,
    allergyInfo: String,
    ingredients: [String],
    instructions: [String],
  },
  { collection: "recipes" }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe;
