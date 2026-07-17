const { generateText } = require('../gemini/geminiGeneration');
const buildDialoguePrompt = require('../prompts/templates/dialogue.prompt');
const Character = require('../../models/character.model');
const ApiError = require('../../utils/apiError');

async function generateDialogue({ characterIds, sceneContext }) {
  const characters = await Character.find({ _id: { $in: characterIds } });

  if (characters.length < 2) {
    throw ApiError.badRequest('At least two valid characters are required for dialogue generation');
  }

  const prompt = buildDialoguePrompt({ characters, sceneContext });
  return generateText(prompt, { temperature: 0.9, maxOutputTokens: 1200 });
}

module.exports = { generateDialogue };
