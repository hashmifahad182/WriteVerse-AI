const { generateText } = require('../gemini/geminiGeneration');
const { buildPlotSuggestionsPrompt } = require('../prompts/templates/summaryAndPlot.prompt');
const { buildStructuredContext, formatStructuredContext } = require('../prompts/promptBuilder');
const Chapter = require('../../models/chapter.model');

async function generatePlotSuggestions({ storyId, requestType }) {
  const [structuredContext, chapters] = await Promise.all([
    buildStructuredContext(storyId),
    Chapter.find({ story: storyId }).sort({ order: -1 }).limit(3),
  ]);

  const recentSummary = chapters
    .reverse()
    .map((c) => c.summary || '')
    .filter(Boolean)
    .join(' ');

  const prompt = buildPlotSuggestionsPrompt({
    structuredContextText: formatStructuredContext(structuredContext),
    recentSummary: recentSummary || 'No chapters written yet.',
    requestType,
  });

  return generateText(prompt, { temperature: 1.0, maxOutputTokens: 800 });
}

module.exports = { generatePlotSuggestions };
