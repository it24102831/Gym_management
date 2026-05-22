import {
  generateWorkoutPlan,
  generateFocusedWorkout,
  generateCardioSession,
  generateProgressionPlan,
} from '../services/workoutGeneratorService.js';
import User from '../models/User.js';

// Generate personalized workout plan based on user profile
export const generatePersonalizedWorkoutPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      goal = 'muscle_building',
      daysPerWeek = 4,
      sessionDuration = 60,
      availableEquipment = ['barbell', 'dumbbell', 'machine'],
      focusAreas = ['chest', 'back', 'legs', 'shoulders'],
    } = req.body;

    // Fetch user profile for context
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      goal: goal || user.goal || 'muscle_building',
      fitnessLevel: user.activityLevel || 'intermediate',
      daysPerWeek,
      sessionDuration,
      availableEquipment,
      focusAreas,
    };

    const result = await generateWorkoutPlan(userProfile);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Workout plan generated successfully',
    });
  } catch (error) {
    console.error('Workout plan generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate workout plan',
    });
  }
};

// Generate focused workout for specific muscle group
export const generateFocusedWorkoutController = async (req, res) => {
  try {
    const { focusMuscle = 'chest', difficulty = 'intermediate', duration = 45, equipment = 'all', exerciseCount = 5 } = req.body;

    const constraints = {
      difficulty,
      duration,
      equipment,
      exerciseCount,
    };

    const result = await generateFocusedWorkout(focusMuscle, constraints);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Focused workout generated successfully',
    });
  } catch (error) {
    console.error('Focused workout generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate focused workout',
    });
  }
};

// Generate cardio session
export const generateCardioSessionController = async (req, res) => {
  try {
    const { cardioType = 'steady_state', duration = 30, intensity = 'moderate', goal = 'fat_loss' } = req.body;

    const result = await generateCardioSession(cardioType, duration);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Cardio session generated successfully',
    });
  } catch (error) {
    console.error('Cardio session generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate cardio session',
    });
  }
};

// Generate progression plan for specific exercise
export const generateProgressionPlanController = async (req, res) => {
  try {
    const { exercise, weeks = 12, startingStrength = 'intermediate', goal = 'progressive_overload' } = req.body;

    if (!exercise) {
      return res.status(400).json({ error: 'Exercise name is required' });
    }

    const result = await generateProgressionPlan(exercise, weeks);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Progression plan generated successfully',
    });
  } catch (error) {
    console.error('Progression plan generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate progression plan',
    });
  }
};
