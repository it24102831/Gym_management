import express from 'express';
import {
  generatePersonalizedMealPlan,
  generateSingleMealController,
  generateMacroOptimizedMealController,
} from '../controllers/mealGeneratorController.js';

const router = express.Router();

// Generate personalized meal plan for user
router.post('/personalized/:userId', generatePersonalizedMealPlan);

// Generate single meal with constraints
router.post('/single', generateSingleMealController);

// Generate meal with macro targets
router.post('/macro-optimized', generateMacroOptimizedMealController);

export default router;
