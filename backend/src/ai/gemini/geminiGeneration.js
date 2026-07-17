const { ai, GEMINI_MODEL, DEFAULT_GENERATION_CONFIG } = require('../../config/gemini.config');
const logger = require('../../utils/logger');
const ApiError = require('../../utils/apiError');

/**
 * Single entry point for all text generation calls to Gemini. Every
 * AI orchestration file calls THIS function rather than touching the
 * Gemini SDK directly — centralizes retry logic, error handling, and
 * usage metadata extraction.
 *
 * Migrated to the @google/genai SDK (Gemini 2.5 Flash). Public signature
 * is unchanged so no orchestration file needs to change.
 */
async function generateText(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    return {
      text: response.text || "",
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0,
      latencyMs: 0,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { generateText };
