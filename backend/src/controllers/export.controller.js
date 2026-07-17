const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const storyService = require('../services/story.service');
const chapterService = require('../services/chapter.service');
const { logPromptHistory } = require('../services/promptLogger.service');

const { translateChapter } = require('../ai/orchestration/translate.ai');
const { generateTitles } = require('../ai/orchestration/titleGenerator.ai');
const { generateCoverPrompt } = require('../ai/orchestration/coverPrompt.ai');
const { summarizeStory } = require('../ai/orchestration/storySummary.ai');
const { generatePlotSuggestions } = require('../ai/orchestration/plotSuggestions.ai');

const translate = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const { chapterId, targetLanguage } = req.body;
  const chapter = await chapterService.getChapterById(chapterId, story._id);

  const result = await translateChapter({ content: chapter.content, targetLanguage, storyId: story._id });

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    chapterId,
    actionType: 'translate',
    options: { targetLanguage },
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(200, { translatedText: result.text }).send(res);
});

const generateTitleOptions = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const { summary } = req.body;

  const result = await generateTitles({ genre: story.genre, summary, type: story.type });

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    actionType: 'title_generator',
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(200, { titles: result.titles }).send(res);
});

const generateCover = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const { summary } = req.body;

  const result = await generateCoverPrompt({ story, summary });

  story.coverPrompt = result.text;
  await story.save();

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    actionType: 'cover_prompt',
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(200, { coverPrompt: result.text }).send(res);
});

const getStorySummary = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const result = await summarizeStory({ story });

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    actionType: 'story_summary',
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(200, { summary: result.text }).send(res);
});

const getPlotSuggestions = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const { requestType } = req.query;

  const result = await generatePlotSuggestions({ storyId: story._id, requestType });

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    actionType: 'plot_suggestion',
    options: { requestType },
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(200, { suggestions: result.text }).send(res);
});

module.exports = {
  translate,
  generateTitleOptions,
  generateCover,
  getStorySummary,
  getPlotSuggestions,
};
