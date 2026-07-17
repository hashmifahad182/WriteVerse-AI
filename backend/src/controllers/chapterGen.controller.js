const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const storyService = require('../services/story.service');
const chapterService = require('../services/chapter.service');
const { logPromptHistory } = require('../services/promptLogger.service');
const { checkGeneratedTextConsistency } = require('../services/consistencyChecker.service');
const { generateChapter } = require('../ai/orchestration/chapterGeneration.ai');
const { summarizeChapter } = require('../ai/orchestration/storySummary.ai');
const { indexChapter } = require('../rag/ragPipeline');
const Chapter = require('../models/chapter.model');

/**
 * Generates a new AI-written chapter, persists it as a draft, and
 * kicks off summary generation + RAG indexing so it's immediately
 * available as context for the NEXT chapter generation.
 */
const generateChapterHandler = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const { title, wordCount, genre, writingStyle, pov, instructions } = req.body;

  let result;
  try {
    result = await generateChapter({ story, chapterTitle: title, wordCount, genre, writingStyle, pov, instructions });
  } catch (err) {
    await logPromptHistory({
      userId: req.user._id,
      storyId: story._id,
      actionType: 'generate_chapter',
      inputText: title,
      options: { wordCount, genre, writingStyle, pov },
      status: 'failed',
      errorMessage: err.message,
    });
    throw err;
  }

  const warnings = await checkGeneratedTextConsistency(story._id, result.text);

  const existingChapters = await Chapter.countDocuments({ story: story._id });
  const chapter = await chapterService.createChapter(story._id, {
    title,
    order: existingChapters + 1,
    content: result.text,
    status: 'draft',
  });

  // Generate a summary immediately (used by future chapter generations)
  const summaryResult = await summarizeChapter({ chapterContent: chapter.content });
  chapter.summary = summaryResult.text;
  await chapter.save();

  // Index in background — don't block the response on embedding calls
  indexChapter(story._id, chapter).catch(() => {});

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    chapterId: chapter._id,
    actionType: 'generate_chapter',
    inputText: title,
    options: { wordCount, genre, writingStyle, pov },
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(201, { chapter, warnings }, 'Chapter generated successfully').send(res);
});

module.exports = { generateChapterHandler };
