# System Architecture: AI Meal & Workout Generators

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)                │
│  (Users request meal/workout plans through UI screens)      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│  POST /api/generators/meal/*                                │
│  POST /api/generators/workout/*                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                        │
│  (server.js)                                                │
│  - Routing                                                  │
│  - Middleware                                               │
│  - Authentication                                           │
└────────────┬──────────────────────────┬─────────────────────┘
             │                          │
             ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   MEAL GENERATOR         │  │  WORKOUT GENERATOR       │
│   CONTROLLER & SERVICE   │  │  CONTROLLER & SERVICE    │
│                          │  │                          │
│ - generateMealPlan()     │  │ - generateWorkoutPlan()  │
│ - generateSingleMeal()   │  │ - generateFocusedWO()    │
│ - generateMacroMeal()    │  │ - generateCardio()       │
│                          │  │ - generateProgression()  │
└────────┬─────────────────┘  └────────┬─────────────────┘
         │                             │
         └──────────────┬──────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │     RAG SERVICE              │
         │ (ragService.js)              │
         │                              │
         │ - retrieveRelevantDocs()     │
         │ - Vector embeddings          │
         │ - Knowledge base mgmt        │
         └────┬──────────────┬──────────┘
              │              │
         ┌────▼──────┐  ┌────▼──────┐
         │   MEAL    │  │ WORKOUT   │
         │   VECTOR  │  │  VECTOR   │
         │   STORE   │  │   STORE   │
         └───────────┘  └───────────┘
              │              │
              └──────┬───────┘
                     │
                     ▼
         ┌──────────────────────────────┐
         │    OLLAMA LLM SERVICE        │
         │ (ollamaService.js)           │
         │                              │
         │ - Local Language Model       │
         │ - Text Generation            │
         │ - No API calls (Private)     │
         └──────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────────┐
         │   OLLAMA SERVER              │
         │ (localhost:11434)            │
         │                              │
         │ - Mistral/Neural-Chat Model  │
         │ - Embedding Generation       │
         └──────────────────────────────┘
             │                │
             ▼                ▼
        ┌──────────┐   ┌──────────────┐
        │ MEAL KB  │   │ WORKOUT KB   │
        │ (18 docs)│   │ (15 docs)    │
        └──────────┘   └──────────────┘
```

## Data Flow: Generate Meal Plan

```
1. USER REQUEST
   ↓
   POST /api/generators/meal/personalized/{userId}
   {
     "mealsPerDay": 3,
     "targetCalories": 2500,
     "goal": "muscle_building"
   }

2. CONTROLLER RECEIVES REQUEST
   ↓
   mealGeneratorController.generatePersonalizedMealPlan()
   - Fetch user profile from DB
   - Validate request

3. SERVICE PROCESSES
   ↓
   mealGeneratorService.generateMealPlan()
   - Create semantic query
   - Build user context

4. RAG RETRIEVAL
   ↓
   ragService.retrieveRelevantDocuments(query, k=10)
   - Query: "muscle_building meal plan 2500 calories"
   - Search vector store
   - Return top 10 documents

5. CONTEXT BUILDING
   ↓
   Combine retrieved meals with user profile
   - User data: goals, preferences
   - Meal options: proteins, carbs, fats, vegetables
   - Dietary constraints: restrictions, allergies

6. LLM GENERATION
   ↓
   ollamaService.generateContent(prompt)
   - Send to Ollama server
   - Model: Mistral generates personalized meal plan
   - Takes 15-30 seconds

7. RESPONSE
   ↓
   {
     "success": true,
     "data": {
       "mealPlan": "Detailed meal plan with meals and macros...",
       "userProfile": {...},
       "timestamp": "2026-05-22T..."
     }
   }

8. FRONTEND DISPLAYS
   ↓
   Mobile app shows generated meal plan to user
```

## Data Flow: Generate Workout Plan

```
1. USER REQUEST
   ↓
   POST /api/generators/workout/personalized/{userId}
   {
     "goal": "muscle_building",
     "daysPerWeek": 4,
     "sessionDuration": 60
   }

2. CONTROLLER RECEIVES
   ↓
   workoutGeneratorController.generatePersonalizedWorkoutPlan()
   - Fetch user profile
   - Validate parameters

3. SERVICE CREATES CONTEXT
   ↓
   workoutGeneratorService.generateWorkoutPlan()
   - Build query from user preferences
   - Determine focus areas

4. RAG RETRIEVAL
   ↓
   ragService.retrieveRelevantDocuments()
   - Query: "muscle_building workout 4 days chest back legs"
   - Similarity search in vector store
   - Retrieve 12 relevant exercises

5. EXERCISE CONTEXT
   ↓
   Retrieved exercises:
   - Bench press (chest strength)
   - Bent-over rows (back mass)
   - Squats (leg strength)
   - Military press (shoulder)
   - ...

6. PROMPT GENERATION
   ↓
   Create detailed prompt with:
   - User goal and level
   - Equipment availability
   - Duration constraints
   - Retrieved exercises

7. LLM GENERATION
   ↓
   ollama.invoke(prompt)
   - Generates customized 4-day split
   - Includes sets, reps, rest periods
   - Provides progression tips
   - Takes 20-30 seconds

8. RESPONSE
   ↓
   {
     "success": true,
     "data": {
       "workoutPlan": "Monday: Upper A...",
       "userProfile": {...},
       "timestamp": "..."
     }
   }

9. DISPLAY & SAVE
   ↓
   User sees plan and can save it
```

## Component Interactions

```
┌──────────────────────────────────────────────────────────────┐
│                   REQUEST PROCESSING FLOW                    │
└──────────────────────────────────────────────────────────────┘

    API Request
         │
         ├─► Validate Input
         │
         ├─► Authentication Check (JWT)
         │
         ├─► Rate Limiting (production)
         │
         ├─► Fetch User Profile from DB
         │
         ├─► RAG Retrieval
         │   ├─► Query Building
         │   ├─► Vector Search
         │   └─► Document Ranking
         │
         ├─► Prompt Engineering
         │   ├─► System Prompt
         │   ├─► Context Injection
         │   └─► User Request
         │
         ├─► LLM Generation (Ollama)
         │   ├─► Model Loading (first time)
         │   ├─► Inference
         │   └─► Post-processing
         │
         └─► Response Formatting & Return
```

## Memory & Resource Usage

```
TYPICAL SYSTEM REQUIREMENTS FOR CONCURRENT REQUESTS:

Single Generation:
  ├─ Model in Memory: ~4GB (Mistral)
  ├─ Working Memory: ~2GB (inference)
  ├─ Vector Store: ~100MB (in-memory)
  └─ Total: ~6GB

Peak Load (2 concurrent requests):
  ├─ Model: ~4GB (shared)
  ├─ Working Memory: ~2GB per request = 4GB
  ├─ Vector Store: ~100MB
  └─ Total: ~8-9GB

Server Specs Recommended:
  ├─ RAM: 16GB minimum
  ├─ CPU: 4-core modern processor
  ├─ Storage: 50GB (for models + OS + app)
  └─ Network: Stable 1Mbps+ connection
```

## Error Handling Flow

```
┌─────────────────────────────────┐
│   GENERATION REQUEST            │
└────────────┬────────────────────┘
             │
             ▼
    ┌────────────────┐
    │ USER NOT FOUND?│─────► 404 Error
    └────────┬───────┘
             │ No
             ▼
    ┌────────────────┐
    │ INVALID INPUT? │─────► 400 Error
    └────────┬───────┘
             │ No
             ▼
    ┌────────────────┐
    │ OLLAMA OFFLINE?│─────► 503 Service Unavailable
    └────────┬───────┘
             │ No
             ▼
    ┌────────────────┐
    │ TIMEOUT (30s)? │─────► 504 Gateway Timeout
    └────────┬───────┘
             │ No
             ▼
    ┌────────────────┐
    │ LLM ERROR?     │─────► 500 Internal Error
    └────────┬───────┘
             │ No
             ▼
    ┌────────────────┐
    │ SUCCESS!       │─────► 200 OK + Response
    └────────────────┘
```

## Scaling Architecture (Future)

```
CURRENT (Single Server):
  Frontend → Backend + Ollama + MongoDB

FUTURE (Horizontal Scaling):
  ┌────────────────────────────────────────────────────┐
  │              LOAD BALANCER (nginx)                 │
  └────────┬──────────────────────────────┬────────────┘
           │                              │
     ┌─────▼─────┐                  ┌─────▼─────┐
     │ Backend 1  │                  │ Backend 2  │
     │ Backend 3  │                  │ Backend 4  │
     └─────┬─────┘                  └─────┬─────┘
           │                              │
           └──────────────┬───────────────┘
                          │
           ┌──────────────┼──────────────┐
           │              │              │
      ┌────▼────┐    ┌────▼────┐  ┌────▼────┐
      │Ollama 1 │    │Ollama 2 │  │Ollama 3 │
      │(GPU)    │    │(GPU)    │  │(GPU)    │
      └─────────┘    └─────────┘  └─────────┘
           │              │              │
           └──────────────┼──────────────┘
                          │
           ┌──────────────┴──────────────┐
           │                             │
      ┌────▼─────┐              ┌────────▼────┐
      │ Pinecone  │              │   MongoDB   │
      │(Vector DB)│              │   Cluster   │
      └───────────┘              └─────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         SECURITY ARCHITECTURE           │
└─────────────────────────────────────────┘

Layer 1: Network
  ├─ HTTPS/TLS encryption
  ├─ Firewall rules
  └─ VPN for internal communication

Layer 2: Authentication
  ├─ JWT tokens
  ├─ User identification
  └─ API key management

Layer 3: Authorization
  ├─ User role validation
  ├─ Resource ownership checks
  └─ Rate limiting

Layer 4: Input Validation
  ├─ Request schema validation
  ├─ Sanitization
  └─ Bounds checking

Layer 5: Data Security
  ├─ MongoDB encryption
  ├─ Vector store security
  └─ No sensitive data in logs

Layer 6: Privacy
  ├─ Local LLM (no data to 3rd party)
  ├─ In-memory processing
  └─ User data isolation
```

