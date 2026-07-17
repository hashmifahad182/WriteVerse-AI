const { generateText } = require('../gemini/geminiGeneration');
const { buildCoverPromptGeneratorPrompt } = require('../prompts/templates/miscGeneration.prompt');
const Character = require('../../models/character.model');

async function generateCoverPrompt({ story, summary }) {
  const mainCharacters = await Character.find({ story: story._id }).limit(3);
  const mainCharacterDescriptions = mainCharacters.map(
    (c) => `${c.name} (${c.personality || 'unspecified personality'})`
  );

  const prompt = buildCoverPromptGeneratorPrompt({
    storyTitle: story.title,
    genre: story.genre,
    summary,
    mainCharacterDescriptions,
  });

  return generateText(prompt, { temperature: 0.9, maxOutputTokens: 400 });
}

module.exports = { generateCoverPrompt };
