const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const chapterService = require('../services/chapter.service');
const storyService = require('../services/story.service');
const { summarizeChapter } = require('../ai/orchestration/storySummary.ai');

const createChapter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const chapter = await chapterService.createChapter(story._id, req.body);
  new ApiResponse(201, { chapter }, 'Chapter created').send(res);
});

const listChapters = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const chapters = await chapterService.listChaptersForStory(story._id);
  new ApiResponse(200, { chapters }).send(res);
});

const getChapter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const chapter = await chapterService.getChapterById(req.params.chapterId, story._id);
  new ApiResponse(200, { chapter }).send(res);
});

const updateChapter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const chapter = await chapterService.updateChapter(req.params.chapterId, story._id, req.body);
  new ApiResponse(200, { chapter }, 'Chapter saved').send(res);
});

const deleteChapter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  await chapterService.deleteChapter(req.params.chapterId, story._id);
  new ApiResponse(200, null, 'Chapter deleted').send(res);
});

// Generates and persists an AI summary for a chapter (used for RAG/context compression)
const generateChapterSummary = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const chapter = await chapterService.getChapterById(req.params.chapterId, story._id);

  const result = await summarizeChapter({ chapterContent: chapter.content });
  chapter.summary = result.text;
  await chapter.save();

  new ApiResponse(200, { summary: result.text }, 'Chapter summary generated').send(res);
});

module.exports = {
  createChapter,
  listChapters,
  getChapter,
  updateChapter,
  deleteChapter,
  generateChapterSummary,
};
