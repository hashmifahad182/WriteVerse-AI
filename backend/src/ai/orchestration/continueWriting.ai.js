const { generateText } = require('../gemini/geminiGeneration');
const buildPrompt = require('../prompts/templates/continueWriting.prompt');
const { buildStructuredContext } = require('../prompts/promptBuilder');
const { retrieveRelevantChunks } = require('../../rag/retrieval.service');

async function continueWriting({ story, cursorContext }) {
  const [structuredContext, retrievedChunks] = await Promise.all([
    buildStructuredContext(story._id),
    retrieveRelevantChunks(story._id, cursorContext.slice(-500), 4),
  ]);

  const prompt = buildPrompt({ structuredContext, retrievedChunks, cursorContext, story });
  return generateText(prompt, { temperature: 0.85, maxOutputTokens: 800 });
}

module.exports = { continueWriting };
