import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { Document } from '@langchain/core/documents';

// Initialize embeddings with Ollama
const embeddings = new OllamaEmbeddings({
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_EMBEDDING_MODEL || 'mistral',
});

let vectorStore = null;

// Initialize meal knowledge base
export const initializeMealKnowledgeBase = async () => {
  const mealDocuments = [
    // Protein sources
    new Document({ metadata: { type: 'meal', category: 'protein', calories: 165, protein: 31, fat: 3.6 }, pageContent: 'Chicken breast 100g: High protein, low fat, great for muscle building' }),
    new Document({ metadata: { type: 'meal', category: 'protein', calories: 155, protein: 27, fat: 5 }, pageContent: 'Lean ground turkey 100g: Excellent lean protein source for weight loss' }),
    new Document({ metadata: { type: 'meal', category: 'protein', calories: 120, protein: 26, fat: 1 }, pageContent: 'Fish salmon 100g: Rich in omega-3, supports heart and joint health' }),
    new Document({ metadata: { type: 'meal', category: 'protein', calories: 100, protein: 20, fat: 1.1 }, pageContent: 'Egg whites: Pure protein with minimal fat, ideal for cutting phase' }),
    
    // Carbs
    new Document({ metadata: { type: 'meal', category: 'carbs', calories: 130, carbs: 28, fiber: 3.5 }, pageContent: 'Brown rice 100g: Complex carbohydrates for sustained energy' }),
    new Document({ metadata: { type: 'meal', category: 'carbs', calories: 89, carbs: 20, fiber: 2.7 }, pageContent: 'Sweet potato 100g: Rich in vitamins and complex carbs' }),
    new Document({ metadata: { type: 'meal', category: 'carbs', calories: 77, carbs: 17, fiber: 2.4 }, pageContent: 'Oatmeal 100g: Great source of fiber and sustained energy' }),
    new Document({ metadata: { type: 'meal', category: 'carbs', calories: 95, carbs: 21, fiber: 3 }, pageContent: 'Banana medium: Quick carbs and potassium for post-workout' }),
    
    // Healthy fats
    new Document({ metadata: { type: 'meal', category: 'fats', calories: 160, fat: 14, protein: 6 }, pageContent: 'Almonds 30g: Healthy fats and vitamins for overall health' }),
    new Document({ metadata: { type: 'meal', category: 'fats', calories: 160, fat: 14, protein: 2 }, pageContent: 'Olive oil 1tbsp: Essential for hormone production and recovery' }),
    new Document({ metadata: { type: 'meal', category: 'fats', calories: 180, fat: 20, protein: 2 }, pageContent: 'Avocado half: Nutrient-dense healthy fats' }),
    
    // Vegetables
    new Document({ metadata: { type: 'meal', category: 'vegetables', calories: 31, carbs: 7, fiber: 2.7 }, pageContent: 'Broccoli 100g: High fiber, low calorie, rich in micronutrients' }),
    new Document({ metadata: { type: 'meal', category: 'vegetables', calories: 18, carbs: 4, fiber: 1 }, pageContent: 'Spinach 100g: Iron and vitamins for energy and recovery' }),
    new Document({ metadata: { type: 'meal', category: 'vegetables', calories: 25, carbs: 6, fiber: 1.2 }, pageContent: 'Bell pepper 100g: Vitamin C for immune system and collagen' }),
    
    // Complete meals
    new Document({ metadata: { type: 'complete_meal', goal: 'muscle_building', calories: 500, protein: 40, carbs: 50, fat: 10 }, pageContent: 'Grilled chicken 150g, brown rice 150g, broccoli 150g, olive oil 1tbsp: High protein muscle building meal' }),
    new Document({ metadata: { type: 'complete_meal', goal: 'weight_loss', calories: 350, protein: 35, carbs: 35, fat: 8 }, pageContent: 'Turkey breast 150g, sweet potato 100g, spinach salad: Low calorie, high protein for cutting' }),
    new Document({ metadata: { type: 'complete_meal', goal: 'cardio', calories: 450, protein: 30, carbs: 60, fat: 8 }, pageContent: 'Salmon 120g, rice 150g, asparagus: Balanced meal for endurance athletes' }),
  ];

  vectorStore = await MemoryVectorStore.fromDocuments(mealDocuments, embeddings);
  return vectorStore;
};

// Initialize workout knowledge base
export const initializeWorkoutKnowledgeBase = async () => {
  const workoutDocuments = [
    // Chest exercises
    new Document({ metadata: { type: 'exercise', muscle: 'chest', difficulty: 'beginner', equipment: 'barbell' }, pageContent: 'Bench press: Primary chest exercise, 3-4 sets of 6-8 reps for strength' }),
    new Document({ metadata: { type: 'exercise', muscle: 'chest', difficulty: 'intermediate', equipment: 'dumbbell' }, pageContent: 'Dumbbell flyes: Isolation exercise for chest, 3 sets of 8-12 reps' }),
    new Document({ metadata: { type: 'exercise', muscle: 'chest', difficulty: 'beginner', equipment: 'bodyweight' }, pageContent: 'Push-ups: Versatile chest exercise, 3 sets to failure' }),
    
    // Back exercises
    new Document({ metadata: { type: 'exercise', muscle: 'back', difficulty: 'intermediate', equipment: 'barbell' }, pageContent: 'Deadlift: Compound back exercise, 3 sets of 5-6 reps for strength' }),
    new Document({ metadata: { type: 'exercise', muscle: 'back', difficulty: 'intermediate', equipment: 'barbell' }, pageContent: 'Bent-over rows: Back mass builder, 4 sets of 6-8 reps' }),
    new Document({ metadata: { type: 'exercise', muscle: 'back', difficulty: 'beginner', equipment: 'machine' }, pageContent: 'Lat pulldowns: Isolation for lats, 3 sets of 8-12 reps' }),
    
    // Legs
    new Document({ metadata: { type: 'exercise', muscle: 'legs', difficulty: 'intermediate', equipment: 'barbell' }, pageContent: 'Squats: Primary leg exercise, 4 sets of 6-8 reps for strength' }),
    new Document({ metadata: { type: 'exercise', muscle: 'legs', difficulty: 'beginner', equipment: 'machine' }, pageContent: 'Leg press: Alternative leg builder, 3 sets of 8-10 reps' }),
    new Document({ metadata: { type: 'exercise', muscle: 'legs', difficulty: 'intermediate', equipment: 'dumbbell' }, pageContent: 'Walking lunges: Functional leg exercise, 3 sets of 10-12 per leg' }),
    
    // Shoulders
    new Document({ metadata: { type: 'exercise', muscle: 'shoulders', difficulty: 'beginner', equipment: 'barbell' }, pageContent: 'Military press: Shoulder strength builder, 3 sets of 6-8 reps' }),
    new Document({ metadata: { type: 'exercise', muscle: 'shoulders', difficulty: 'intermediate', equipment: 'dumbbell' }, pageContent: 'Lateral raises: Shoulder width builder, 3 sets of 10-15 reps' }),
    
    // Cardio
    new Document({ metadata: { type: 'cardio', difficulty: 'beginner', duration: '20-30', intensity: 'moderate' }, pageContent: 'Steady-state running: Build aerobic base, 20-30 minutes at conversational pace' }),
    new Document({ metadata: { type: 'cardio', difficulty: 'intermediate', duration: '20', intensity: 'high' }, pageContent: 'HIIT sprints: 30 seconds all-out, 30 seconds rest, repeat 10-15 times for fat loss' }),
    
    // Workout programs
    new Document({ metadata: { type: 'program', goal: 'muscle_building', duration: '4_weeks', difficulty: 'intermediate' }, pageContent: 'Upper/Lower Split: 4 days per week, Upper A (bench, rows), Upper B (shoulders, isolations), Lower A (squat), Lower B (deadlift)' }),
    new Document({ metadata: { type: 'program', goal: 'weight_loss', duration: '4_weeks', difficulty: 'beginner' }, pageContent: 'Full body 3x: 3 days per week, combine compound lifts with cardio, 45 min sessions' }),
    new Document({ metadata: { type: 'program', goal: 'strength', duration: '8_weeks', difficulty: 'advanced' }, pageContent: '5x5 Stronglift program: Focus on compound lifts, progressive overload' }),
  ];

  vectorStore = await MemoryVectorStore.fromDocuments(workoutDocuments, embeddings);
  return vectorStore;
};

// Retrieve relevant documents
export const retrieveRelevantDocuments = async (query, k = 3) => {
  if (!vectorStore) {
    throw new Error('Vector store not initialized. Call initialize first.');
  }

  const results = await vectorStore.similaritySearch(query, k);
  return results;
};

// Add custom documents to knowledge base
export const addDocumentsToKnowledgeBase = async (documents) => {
  if (!vectorStore) {
    vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
  } else {
    await vectorStore.addDocuments(documents);
  }
};

export const getVectorStore = () => vectorStore;
