import { Ollama } from '@langchain/ollama';

const ollama = new Ollama({
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'mistral',
});

export const getOllama = () => ollama;

export const generateContent = async (prompt) => {
  try {
    const response = await ollama.invoke(prompt);
    return response;
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw error;
  }
};
