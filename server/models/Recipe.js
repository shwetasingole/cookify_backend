import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
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


RecipeSchema.index({
  title: "text",
  ingredients: "text",
  mealType: "text",
  dietType: "text",
  allergyInfo: "text",
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

export default Recipe;
