import express from 'express';
import {
  generatePersonalizedWorkoutPlan,
  generateFocusedWorkoutController,
  generateCardioSessionController,
  generateProgressionPlanController,
} from '../controllers/workoutGeneratorController.js';

const router = express.Router();

// Generate personalized workout plan for user
router.post('/personalized/:userId', generatePersonalizedWorkoutPlan);

// Generate focused workout for specific muscle group
router.post('/focused', generateFocusedWorkoutController);

// Generate cardio session
router.post('/cardio', generateCardioSessionController);

// Generate progression plan for exercise
router.post('/progression', generateProgressionPlanController);

export default router;
