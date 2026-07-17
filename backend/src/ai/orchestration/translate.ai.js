const { generateText } = require('../gemini/geminiGeneration');
const buildTranslatePrompt = require('../prompts/templates/miscGeneration.prompt').buildTranslatePrompt;
const Character = require('../../models/character.model');

async function translateChapter({ content, targetLanguage, storyId }) {
  const characters = await Character.find({ story: storyId }).select('name aliases');
  const characterNames = characters.flatMap((c) => [c.name, ...(c.aliases || [])]);

  const prompt = buildTranslatePrompt({ content, targetLanguage, characterNames });
  return generateText(prompt, { temperature: 0.3, maxOutputTokens: 4096 });
}

module.exports = { translateChapter };
