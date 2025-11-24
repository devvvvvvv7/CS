import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: Using API key in client-side is not recommended for production
// Consider using a backend service or Lovable Cloud for secure API key management
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiModel = (modelName: string = 'gemini-2.0-flash-exp') => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateAIResponse = async (prompt: string, conversationHistory: any[] = []) => {
  const model = getGeminiModel();
  const chat = model.startChat({
    history: conversationHistory,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
};
