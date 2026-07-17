const { generateText } = require('../gemini/geminiGeneration');
const { buildTitleGeneratorPrompt } = require('../prompts/templates/miscGeneration.prompt');

async function generateTitles({ genre, summary, type }) {
  const prompt = buildTitleGeneratorPrompt({ genre, summary, type });
  const result = await generateText(prompt, { temperature: 1.0, maxOutputTokens: 400 });

  const titles = result.text
    .split('\n')
    .map((line) => line.replace(/^\d+[.)]\s*/, '').trim())
    .filter(Boolean);

  return { ...result, titles };
}

module.exports = { generateTitles };
