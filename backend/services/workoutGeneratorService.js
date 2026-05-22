import { ChatPromptTemplate } from '@langchain/core/prompts';
import { getOllama } from './ollamaService.js';
import { retrieveRelevantDocuments } from './ragService.js';

const llm = getOllama();

export const generateWorkoutPlan = async (userProfile) => {
  const {
    goal = 'muscle_building', // muscle_building, strength, weight_loss, endurance
    fitnessLevel = 'intermediate', // beginner, intermediate, advanced
    daysPerWeek = 4,
    sessionDuration = 60,
    availableEquipment = ['barbell', 'dumbbell', 'machine'], // barbell, dumbbell, machine, bodyweight
    focusAreas = ['chest', 'back', 'legs', 'shoulders'],
  } = userProfile;

  try {
    // Retrieve relevant workout documents from RAG
    const query = `${goal} workout ${fitnessLevel} ${daysPerWeek} days per week ${focusAreas.join(' ')}`;
    const relevantWorkouts = await retrieveRelevantDocuments(query, 12);

    const workoutContext = relevantWorkouts
      .map((doc) => doc.pageContent)
      .join('\n');

    // Create prompt template
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a certified personal trainer and strength coach. Create personalized workout programs based on fitness goals, level, and preferences.
        
        Available exercises and programs:
        ${workoutContext}
        
        Consider the following:
        - Goal: ${goal}
        - Fitness Level: ${fitnessLevel}
        - Training Days per Week: ${daysPerWeek}
        - Session Duration: ${sessionDuration} minutes
        - Available Equipment: ${availableEquipment.join(', ')}
        - Focus Areas: ${focusAreas.join(', ')}`,
      ],
      [
        'human',
        `Create a detailed ${daysPerWeek}-day workout plan for me. For each workout day, include:
        1. Warm-up (5 minutes)
        2. Main exercises (include sets, reps, rest periods, and progression tips)
        3. Cool-down (5 minutes)
        4. Target muscle groups
        5. Estimated time
        
        Make sure the plan aligns with my ${goal} goal and ${fitnessLevel} fitness level.
        Only use exercises that can be done with: ${availableEquipment.join(', ')}`,
      ],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({});

    return {
      success: true,
      workoutPlan: response,
      userProfile,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Workout generation error:', error);
    throw new Error(`Failed to generate workout plan: ${error.message}`);
  }
};

export const generateFocusedWorkout = async (focusMuscle, constraints = {}) => {
  const {
    difficulty = 'intermediate',
    duration = 45,
    equipment = 'all',
    exerciseCount = 5,
  } = constraints;

  try {
    const query = `${focusMuscle} workout ${difficulty} ${equipment}`;
    const relevantExercises = await retrieveRelevantDocuments(query, 8);

    const exerciseContext = relevantExercises
      .map((doc) => doc.pageContent)
      .join('\n');

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are an experienced personal trainer specializing in targeted muscle group training.
        
        Available exercises:
        ${exerciseContext}`,
      ],
      [
        'human',
        `Create a focused ${focusMuscle} workout session with these parameters:
        - Difficulty: ${difficulty}
        - Duration: ${duration} minutes
        - Equipment available: ${equipment}
        - Number of exercises: ${exerciseCount}
        
        For each exercise provide:
        1. Exercise name
        2. Sets and reps
        3. Rest period
        4. Form tips
        5. Progression cues`,
      ],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({});

    return {
      success: true,
      workout: response,
      focusMuscle,
      constraints,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Focused workout generation error:', error);
    throw new Error(`Failed to generate focused workout: ${error.message}`);
  }
};

export const generateCardioSession = async (cardioType, duration) => {
  const {
    type = 'steady_state', // steady_state, HIIT, Tabata, circuit
    durationMinutes = 30,
    intensity = 'moderate', // low, moderate, high
    goal = 'fat_loss', // fat_loss, cardio_endurance, recovery
  } = { type: cardioType, durationMinutes: duration };

  try {
    const query = `${type} cardio ${intensity} ${durationMinutes} minutes ${goal}`;
    const relevantCardio = await retrieveRelevantDocuments(query, 5);

    const cardioContext = relevantCardio
      .map((doc) => doc.pageContent)
      .join('\n');

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a certified cardio and conditioning specialist.
        
        Available cardio options:
        ${cardioContext}`,
      ],
      [
        'human',
        `Design a ${type} cardio session with these specifications:
        - Duration: ${durationMinutes} minutes
        - Intensity: ${intensity}
        - Goal: ${goal}
        
        Include:
        1. Warm-up strategy
        2. Work/rest intervals if applicable
        3. Exercise variations
        4. Cool-down protocol
        5. Heart rate zones if relevant`,
      ],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({});

    return {
      success: true,
      cardioSession: response,
      cardioType,
      duration,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Cardio session generation error:', error);
    throw new Error(`Failed to generate cardio session: ${error.message}`);
  }
};

export const generateProgressionPlan = async (currentExercise, duration = 12) => {
  const {
    exercise = currentExercise,
    weeks = duration,
    startingStrength = 'intermediate',
    goal = 'progressive_overload',
  } = { exercise: currentExercise, weeks: duration };

  try {
    const query = `progression ${exercise} strength building advanced training`;
    const relevantInfo = await retrieveRelevantDocuments(query, 6);

    const context = relevantInfo
      .map((doc) => doc.pageContent)
      .join('\n');

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are an advanced strength and conditioning coach specializing in periodized training.
        
        Reference material:
        ${context}`,
      ],
      [
        'human',
        `Create a ${weeks}-week progression plan for ${exercise} to achieve ${goal}.
        
        Starting from ${startingStrength} level, provide:
        1. Weekly progression milestones
        2. Volume and intensity adjustments
        3. Rest day recommendations
        4. Deload weeks if applicable
        5. Expected results and timeline
        6. Form cues for injury prevention`,
      ],
    ]);

    const chain = prompt.pipe(llm);
    const response = await chain.invoke({});

    return {
      success: true,
      progressionPlan: response,
      exercise,
      duration,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Progression plan generation error:', error);
    throw new Error(`Failed to generate progression plan: ${error.message}`);
  }
};
