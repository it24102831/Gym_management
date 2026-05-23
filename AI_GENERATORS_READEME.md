# AI-Powered Meal & Workout Generators

## Overview
This document describes the new AI-powered meal and workout generators integrated into the Gym Management system using **LangChain** with **RAG (Retrieval-Augmented Generation)** and **Ollama** (local LLM).

## Architecture

### Components

1. **Ollama Service** (`ollamaService.js`)
   - Manages connection to local Ollama LLM
   - Handles text generation requests
   - Uses local models for privacy and cost efficiency

2. **RAG Service** (`ragService.js`)
   - Manages vector embeddings and similarity search
   - Maintains meal and workout knowledge bases
   - Uses `MemoryVectorStore` for in-memory vector storage
   - Supports document retrieval based on semantic similarity

3. **Meal Generator Service** (`mealGeneratorService.js`)
   - Generates personalized meal plans
   - Creates single meal suggestions
   - Produces macro-optimized meals
   - Uses RAG to retrieve relevant meal data

4. **Workout Generator Service** (`workoutGeneratorService.js`)
   - Generates personalized workout programs
   - Creates focused muscle-group workouts
   - Designs cardio sessions
   - Builds exercise progression plans
   - Uses RAG to retrieve relevant exercises

### API Endpoints

#### Meal Generator Endpoints

**1. Generate Personalized Meal Plan**
```
POST /api/generators/meal/personalized/:userId
```

Request body:
```json
{
  "mealsPerDay": 3,
  "targetCalories": 2500,
  "dietaryRestrictions": ["vegan", "gluten-free"],
  "allergies": ["peanuts"]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "success": true,
    "mealPlan": "Generated meal plan details...",
    "userProfile": {...},
    "timestamp": "2026-05-22T..."
  }
}
```

**2. Generate Single Meal**
```
POST /api/generators/meal/single
```

Request body:
```json
{
  "mealType": "lunch",
  "calories": 500,
  "cuisine": "Italian",
  "prepTime": 30,
  "servings": 1
}
```

**3. Generate Macro-Optimized Meal**
```
POST /api/generators/meal/macro-optimized
```

Request body:
```json
{
  "protein": 40,
  "carbs": 50,
  "fats": 15,
  "totalCalories": 600
}
```

#### Workout Generator Endpoints

**1. Generate Personalized Workout Plan**
```
POST /api/generators/workout/personalized/:userId
```

Request body:
```json
{
  "goal": "muscle_building",
  "daysPerWeek": 4,
  "sessionDuration": 60,
  "availableEquipment": ["barbell", "dumbbell", "machine"],
  "focusAreas": ["chest", "back", "legs"]
}
```

**2. Generate Focused Workout**
```
POST /api/generators/workout/focused
```

Request body:
```json
{
  "focusMuscle": "chest",
  "difficulty": "intermediate",
  "duration": 45,
  "equipment": "all",
  "exerciseCount": 5
}
```

**3. Generate Cardio Session**
```
POST /api/generators/workout/cardio
```

Request body:
```json
{
  "cardioType": "HIIT",
  "duration": 30,
  "intensity": "high",
  "goal": "fat_loss"
}
```

**4. Generate Progression Plan**
```
POST /api/generators/workout/progression
```

Request body:
```json
{
  "exercise": "bench_press",
  "weeks": 12,
  "startingStrength": "intermediate",
  "goal": "progressive_overload"
}
```

## Setup Instructions

### Prerequisites
1. **Ollama** installed and running locally
2. **Node.js** and npm
3. **MongoDB** for user data

### Installation

1. **Install Ollama**
   - Download from https://ollama.ai
   - Run: `ollama pull mistral` (or your preferred model)
   - Start Ollama: `ollama serve`

2. **Install Dependencies**
   ```bash
   cd backend
   npm install --legacy-peer-deps
   ```

3. **Configure Environment**
   - Update `.env` with your Ollama settings:
   ```
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=mistral
   OLLAMA_EMBEDDING_MODEL=mistral
   ```

4. **Start the Backend**
   ```bash
   npm run dev
   ```

## Knowledge Base Structure

### Meal Knowledge Base
The meal knowledge base includes:
- **Protein sources**: Chicken, turkey, fish, eggs
- **Carbohydrates**: Rice, sweet potato, oatmeal, banana
- **Healthy fats**: Almonds, olive oil, avocado
- **Vegetables**: Broccoli, spinach, bell peppers
- **Complete meals**: Pre-planned combinations by goal

### Workout Knowledge Base
The workout knowledge base includes:
- **Chest exercises**: Bench press, flyes, push-ups
- **Back exercises**: Deadlifts, rows, lat pulldowns
- **Leg exercises**: Squats, leg press, lunges
- **Shoulder exercises**: Military press, lateral raises
- **Cardio**: Steady-state running, HIIT, Tabata
- **Workout programs**: Split routines, full-body, strength

## How It Works

### RAG Flow
1. **User Request** → API endpoint receives user preferences
2. **Query Generation** → System creates semantic query from request
3. **Similarity Search** → Searches knowledge base for relevant documents
4. **Context Building** → Combines retrieved documents into LLM context
5. **LLM Generation** → Ollama generates personalized recommendations
6. **Response** → Returns generated content to user

### Example Workflow: Generating a Meal Plan

```
User Profile: 
- Goal: Weight loss
- Target: 2000 calories
- Restrictions: Vegetarian

↓

RAG Query: "weight loss meal plan 2000 calories vegetarian"

↓

Retrieved Documents:
- High protein vegetables
- Low calorie carbs
- Healthy fats options

↓

LLM Prompt:
"Create a 3-meal vegetarian diet for weight loss with 2000 total calories..."

↓

Generated Meal Plan:
- Breakfast: Greek yogurt with berries
- Lunch: Quinoa Buddha bowl
- Dinner: Grilled tofu with vegetables
```

## Customization

### Adding Custom Meal Documents
```javascript
import { Document } from 'langchain/document';
import { addDocumentsToKnowledgeBase } from './services/ragService.js';

const customMeals = [
  new Document({
    metadata: { 
      type: 'meal',
      category: 'custom',
      calories: 350 
    },
    pageContent: 'Your meal description...'
  })
];

await addDocumentsToKnowledgeBase(customMeals);
```

### Changing LLM Model
Update `.env`:
```
OLLAMA_MODEL=neural-chat  # or any other Ollama model
```

### Adjusting RAG Retrieval
Modify the `k` parameter in `retrieveRelevantDocuments()`:
```javascript
const documents = await retrieveRelevantDocuments(query, k=5); // Retrieve 5 documents
```

## Performance Considerations

1. **Ollama Performance**
   - First run may take 10-15 seconds to load model
   - Subsequent requests are faster
   - Consider model size vs. performance trade-off

2. **Vector Store**
   - Currently uses in-memory storage
   - For production, consider Pinecone, Weaviate, or Qdrant
   - Scales to thousands of documents

3. **Response Time**
   - Full meal plan: 15-30 seconds
   - Single meal: 8-15 seconds
   - Depends on Ollama model and system specs

## Troubleshooting

### Ollama Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:11434
```
- Make sure Ollama is running: `ollama serve`
- Check OLLAMA_BASE_URL in .env

### Out of Memory
```
Error: CUDA out of memory
```
- Use smaller model: `ollama pull neural-chat`
- Reduce batch size in requests

### Generation Timeout
- Increase timeout in service configuration
- Use faster model like `neural-chat` or `orca-mini`

## Future Enhancements

1. **Vector Database Integration**
   - Migrate from MemoryVectorStore to Pinecone/Weaviate
   - Persistent storage for larger knowledge bases

2. **User Preference Learning**
   - Track user feedback on generated plans
   - Fine-tune generation based on preferences

3. **Integration with Existing Logs**
   - Analyze user's meal and workout logs
   - Generate recommendations based on past performance

4. **Real-time Adjustments**
   - WebSocket for streaming generation
   - Live progress updates

5. **Advanced RAG**
   - Hybrid search (vector + keyword)
   - Multi-stage retrieval and ranking
   - Query expansion and rewriting

## API Examples

### cURL Examples

Generate meal plan:
```bash
curl -X POST http://localhost:5050/api/generators/meal/personalized/userId123 \
  -H "Content-Type: application/json" \
  -d '{
    "mealsPerDay": 3,
    "targetCalories": 2500
  }'
```

Generate workout:
```bash
curl -X POST http://localhost:5050/api/generators/workout/personalized/userId123 \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "muscle_building",
    "daysPerWeek": 4
  }'
```

## License
This feature is part of the Gym Management System.
