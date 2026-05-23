# Quick Start Guide: AI Generators

## 1. Setup Ollama

### Install Ollama
- Download from: https://ollama.ai
- Install and run

### Pull a Model
```bash
ollama pull mistral
```

### Start Ollama Server
```bash
ollama serve
```
Server will run on `http://localhost:11434`

## 2. Install Dependencies

```bash
cd backend
npm install --legacy-peer-deps
```

## 3. Configure Environment

Update `backend/.env`:
```
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_EMBEDDING_MODEL=mistral
```

## 4. Start Backend

```bash
npm run dev
```

## 5. Test the Generators

### Test Meal Generator
```bash
curl -X POST http://localhost:5050/api/generators/meal/single \
  -H "Content-Type: application/json" \
  -d '{
    "mealType": "lunch",
    "calories": 500
  }'
```

### Test Workout Generator
```bash
curl -X POST http://localhost:5050/api/generators/workout/focused \
  -H "Content-Type: application/json" \
  -d '{
    "focusMuscle": "chest",
    "difficulty": "intermediate"
  }'
```

## Available Ollama Models

- `mistral` - Good balance of speed and quality
- `neural-chat` - Faster, slightly lower quality
- `orca-mini` - Very fast, good for basic queries
- `llama2` - More capable, slower

Pull other models:
```bash
ollama pull neural-chat
ollama pull orca-mini
```

## Troubleshooting

**Q: Getting connection refused error?**
A: Make sure Ollama is running with `ollama serve`

**Q: Responses very slow?**
A: Try a faster model like `neural-chat` or `orca-mini`

**Q: Out of memory?**
A: Use a smaller model or increase system RAM

## Next Steps

1. Check `AI_GENERATORS_README.md` for full documentation
2. Integrate generators into frontend screens
3. Add user feedback tracking for improvements
4. Consider adding Pinecone for scalability
