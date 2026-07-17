const { generateText } = require('../gemini/geminiGeneration');
const {
  buildChapterSummaryPrompt,
  buildStorySummaryPrompt,
} = require('../prompts/templates/summaryAndPlot.prompt');
const Chapter = require('../../models/chapter.model');
const ApiError = require('../../utils/apiError');

async function summarizeChapter({ chapterContent }) {
  const prompt = buildChapterSummaryPrompt({ chapterContent });
  return generateText(prompt, { temperature: 0.3, maxOutputTokens: 300 });
}

async function summarizeStory({ story }) {
  const chapters = await Chapter.find({ story: story._id }).sort({ order: 1 });

  if (chapters.length === 0) {
    throw ApiError.badRequest('Story has no chapters to summarize yet');
  }

  const chapterSummaries = chapters.map((c) => c.summary || '(not yet summarized)');
  const prompt = buildStorySummaryPrompt({ chapterSummaries, storyTitle: story.title });
  return generateText(prompt, { temperature: 0.4, maxOutputTokens: 600 });
}

module.exports = { summarizeChapter, summarizeStory };
