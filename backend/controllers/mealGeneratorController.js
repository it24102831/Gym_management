import {
  generateMealPlan,
  generateSingleMeal,
  generateMacroOptimizedMeal,
} from '../services/mealGeneratorService.js';
import User from '../models/User.js';

// Generate personalized meal plan based on user profile
export const generatePersonalizedMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { mealsPerDay = 3, targetCalories, dietaryRestrictions = [], allergies = [] } = req.body;

    // Fetch user profile for context
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      goal: user.goal || 'muscle_building',
      targetCalories: targetCalories || user.calories || 2500,
      activityLevel: user.activityLevel || 'moderate',
      dietaryRestrictions,
      allergies,
      mealsPerDay,
    };

    const result = await generateMealPlan(userProfile);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Meal plan generated successfully',
    });
  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate meal plan',
    });
  }
};

// Generate single meal with specific constraints
export const generateSingleMealController = async (req, res) => {
  try {
    const { mealType = 'lunch', calories = 500, cuisine = 'any', prepTime = 30, servings = 1 } = req.body;

    const constraints = {
      calories,
      cuisine,
      prepTime,
      servings,
    };

    const result = await generateSingleMeal(mealType, constraints);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Single meal generated successfully',
    });
  } catch (error) {
    console.error('Single meal generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate meal',
    });
  }
};

// Generate meal with specific macronutrient targets
export const generateMacroOptimizedMealController = async (req, res) => {
  try {
    const { protein = 30, carbs = 50, fats = 20, totalCalories = 500 } = req.body;

    const targetMacros = {
      protein,
      carbs,
      fats,
      totalCalories,
    };

    const result = await generateMacroOptimizedMeal(targetMacros);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Macro-optimized meal generated successfully',
    });
  } catch (error) {
    console.error('Macro-optimized meal generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate macro-optimized meal',
    });
  }
};
