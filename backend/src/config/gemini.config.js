const { GoogleGenAI } = require('@google/genai');
const { GEMINI_API_KEY, GEMINI_MODEL, GEMINI_EMBEDDING_MODEL } = require('./env');


console.log("Using Gemini model:", GEMINI_MODEL);
/**
 * Single Gemini client for the whole app (new @google/genai SDK).
 * Unlike the deprecated @google/generative-ai SDK, this SDK does not
 * pre-bind a "model" instance — every call to ai.models.generateContent()
 * / ai.models.embedContent() takes the model name as a parameter. We
 * still centralize the client + defaults here so orchestration files
 * never construct their own client.
 */
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Default generation config, merged into every generateText() call
// unless overridden per-call (see ai/gemini/geminiGeneration.js).
const DEFAULT_GENERATION_CONFIG = {
  maxOutputTokens: 512,
};

module.exports = {
  ai,
  GEMINI_MODEL,
  GEMINI_EMBEDDING_MODEL,
  DEFAULT_GENERATION_CONFIG,
};
