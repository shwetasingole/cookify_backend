import Recipe from "../models/Recipe.js";
import { generateRecipesFromGemini } from "../api/gemini.js";

export const searchrecipe = async (req, res) => {
  const query = req.query.q;
  const userId = req.user.id;
  try {
    const recipes = await Recipe.find({
      userId,
     $text: { $search: query },
    });

    if (!recipes) {
      res
        .status(404)
        .json({ message: "No recipes present", error: error.message });
    } else {
      res.json(recipes);
    }
  } catch (error) {
    res.status(500).json({ message: "naah" });
  }
};

export const insertrecipe = async (req, res) => {
  const { recipes } = req.body;
  const userId = req.user.id;

  if (!recipes || !Array.isArray(recipes)) {
    return res.status(400).json({ error: "Invalid recipes data" });
  }

  const mappedRecipes = recipes.map((r) => ({
    userId,
    title: r.recipe_name,
    time: r.preparation_time,
    servings: r.serving_size,
    calories: r.calories,
    mealType: r.meal_type,
    dietType: r.diet_type,
    allergyInfo: r.allergy_information,
    ingredients: r.ingredients,
    instructions: r.instructions,
  }));

  try {
    const inserted = await Recipe.insertMany(mappedRecipes);

    res.status(201).json({ message: "Recipes stored", inserted });
  } catch (error) {
    console.error("Error inserting recipes:");
    res
      .status(500)
      .json({ error: "Failed to store recipes", details: error.message });
  }
};

export const formatRecipeJson = (data) => {
  try {
    const cleaned = data.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("JSON parsing error:", error);
    return null;
  }
};

export const generatedRecipes = async (req, res) => {
  const { ingredients, formData, otherCuisine } = req.body;
  const cuisineValue =
    !formData.cuisine && otherCuisine ? otherCuisine : formData.cuisine;

  const formDataWithCuisine = {
    ...formData,
    cuisine: cuisineValue,
  };
  const prompt = `Generate 6 recipes based on these inputs. Make sure they are unique:
  Ingredients: [${ingredients.join(", ")}],
  Preferences: [${JSON.stringify(formDataWithCuisine)}].

  - Do not include dietary or allergen restrictions from the preferences input in the generated recipes. Instead, mention possible additional ingredients or details beyond the specified preferences.
  - Avoid excluding elements unnecessarily unless explicitly restricted.
  - Ensure that instructions are detailed and step-by-step for clarity.
  - Each recipe should be structured in JSON format as follows:

  {
      "recipe_name": "Recipe Name",
      "meal_type": "Meal Type",
      "cuisine_type":"Cuisine Type",
      "serving_size":"Serving Size",
      "calories":"Number of Calories [Units]",
      "diet_type": "Diet Type (e.g., Vegetarian, Vegan, etc.)",
      "allergy_information": "Possible allergens (e.g., nuts, dairy, etc.)",
      "preparation_time": "Preparation Time in minutes",
      "ingredients": ["ingredient1", "ingredient2", ...],
      "instructions": ["Step 1", "Step 2", ...]
  }

  - Return only the JSON structure; no additional text.`;

  try {
    const response = await generateRecipesFromGemini(prompt);
    const recipes = formatRecipeJson(response);
    return res.status(200).json({ recipes });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate recipes." });
  }
};

export const chat = async (req, res) => {
  const { messages, input } = req.body;
  if (!input || !messages) {
    return res.status(400).json({ error: "Input and messages absent" });
  }
  try {
    const conversationHistory = messages
      .map(
        (msg) => `${msg.sender === "user" ? "User" : "Cookify"}: ${msg.text}`
      )
      .join("\n");
    const prompt = `You are Cookify, a friendly recipe assistant. Here's the chat so far:\n${conversationHistory}\nUser: ${input}\nCookify:`;
    const reply = await generateRecipesFromGemini(prompt);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to get reply" });
  }
};
