import { ChatPromptTemplate } from '@langchain/core/prompts';
import { getOllama } from './ollamaService.js';
import { retrieveRelevantDocuments } from './ragService.js';

const llm = getOllama();

export const generateMealPlan = async (userProfile) => {
  const {
    goal = 'muscle_building', // muscle_building, weight_loss, maintenance
    dietaryRestrictions = [],
    targetCalories = 2500,
    preferredCuisines = ['Italian', 'Asian', 'Mediterranean'],
    allergies = [],
    mealsPerDay = 3,
    activityLevel = 'moderate',
  } = userProfile;

  try {
    // Retrieve relevant meal documents from RAG
    const query = `${goal} meal plan with ${targetCalories} calories, ${dietaryRestrictions.join(', ')} restrictions`;
    const relevantMeals = await retrieveRelevantDocuments(query, 10);

    const mealContext = relevantMeals
      .map((doc) => doc.pageContent)
      .join('\n');

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a professional nutrition and fitness coach. Generate personalized meal plans based on user goals, 
        preferences, and dietary restrictions. Always prioritize nutrition and balanced macronutrients.
        
        Available meal options:
        ${mealContext}
        
        Consider the following:
        - Goal: ${goal}
        - Target Calories: ${targetCalories}
        - Activity Level: ${activityLevel}
        - Dietary Restrictions: ${dietaryRestrictions.length > 0 ? dietaryRestrictions.join(', ') : 'None'}
        - Allergies: ${allergies.length > 0 ? allergies.join(', ') : 'None'}
        - Preferred Cuisines: ${preferredCuisines.join(', ')}`,
      ],
      [
        'human',
        `Create a detailed ${mealsPerDay}-meal per day plan for me. For each meal, include:
        1. Meal name
        2. Ingredients with quantities
        3. Estimated macronutrients (protein, carbs, fats, calories)
        4. Preparation instructions
        5. Timing recommendation (breakfast/lunch/dinner/snack)
        
        Make sure the total daily calories align with ${targetCalories} and respect all dietary restrictions and allergies.`,
      ],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({});

    return {
      success: true,
      mealPlan: response,
      userProfile,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Meal generation error:', error);
    throw new Error(`Failed to generate meal plan: ${error.message}`);
  }
};

export const generateSingleMeal = async (mealType, constraints = {}) => {
  const { calories = 500, cuisine = 'any', prepTime = 30, servings = 1 } = constraints;

  try {
    const query = `${mealType} meal ${cuisine} cuisine around ${calories} calories`;
    const relevantMeals = await retrieveRelevantDocuments(query, 5);

    const mealContext = relevantMeals
      .map((doc) => doc.pageContent)
      .join('\n');

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a professional chef and nutritionist. Create personalized meal recommendations.
        
        Available meal options:
        ${mealContext}`,
      ],
      [
        'human',
        `Suggest a ${mealType} meal with these constraints:
        - Cuisine: ${cuisine}
        - Target calories: ${calories}
        - Preparation time: ${prepTime} minutes
        - Servings: ${servings}
        
        Include ingredients, cooking instructions, and nutritional info.`,
      ],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({});

    return {
      success: true,
      meal: response,
      constraints,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Single meal generation error:', error);
    throw new Error(`Failed to generate meal: ${error.message}`);
  }
};

export const generateMacroOptimizedMeal = async (targetMacros) => {
  const { protein = 30, carbs = 50, fats = 20, totalCalories = 500 } = targetMacros;

  try {
    const query = `high protein ${protein}g carbs ${carbs}g fats ${fats}g meal`;
    const relevantMeals = await retrieveRelevantDocuments(query, 8);

    const mealContext = relevantMeals
      .map((doc) => doc.pageContent)
      .join('\n');

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a sports nutritionist specializing in macro-based meal planning.
        
        Available meal options:
        ${mealContext}`,
      ],
      [
        'human',
        `Create a meal that matches these macronutrient targets:
        - Protein: ${protein}g
        - Carbohydrates: ${carbs}g
        - Fats: ${fats}g
        - Total Calories: ${totalCalories}
        
        Provide exact portions, ingredients, cooking method, and nutritional breakdown.`,
      ],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({});

    return {
      success: true,
      meal: response,
      targetMacros,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Macro-optimized meal generation error:', error);
    throw new Error(`Failed to generate macro-optimized meal: ${error.message}`);
  }
};
