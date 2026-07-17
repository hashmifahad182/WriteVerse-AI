const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const storyService = require('../services/story.service');
const { logPromptHistory } = require('../services/promptLogger.service');
const { checkGeneratedTextConsistency } = require('../services/consistencyChecker.service');

const { continueWriting } = require('../ai/orchestration/continueWriting.ai');
const { rewrite, improveWriting, expand, shorten, changeTone } = require('../ai/orchestration/rewrite.ai');
const { generateDialogue } = require('../ai/orchestration/dialogue.ai');

/**
 * Shared wrapper: runs an AI orchestration function, logs the result to
 * PromptHistory, and attaches consistency warnings. Every AI writing
 * endpoint follows this exact same pattern, so it's centralized here
 * instead of repeated seven times.
 */
async function handleAiAction({ req, res, actionType, chapterId, inputText, options, run }) {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);

  let result;
  try {
    result = await run(story);
  } catch (err) {
    await logPromptHistory({
      userId: req.user._id,
      storyId: story._id,
      chapterId,
      actionType,
      inputText,
      options,
      status: 'failed',
      errorMessage: err.message,
    });
    throw err;
  }

  const warnings = await checkGeneratedTextConsistency(story._id, result.text);

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    chapterId,
    actionType,
    inputText,
    options,
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(200, { text: result.text, warnings }, 'Generated successfully').send(res);
}

const continueWritingHandler = asyncHandler(async (req, res) => {
  const { chapterId, cursorContext } = req.body;
  await handleAiAction({
    req,
    res,
    actionType: 'continue_writing',
    chapterId,
    inputText: cursorContext,
    run: (story) => continueWriting({ story, cursorContext }),
  });
});

const rewriteHandler = asyncHandler(async (req, res) => {
  const { chapterId, selectedText, style } = req.body;
  await handleAiAction({
    req,
    res,
    actionType: 'rewrite',
    chapterId,
    inputText: selectedText,
    options: { style },
    run: () => rewrite({ selectedText, style }),
  });
});

const improveWritingHandler = asyncHandler(async (req, res) => {
  const { chapterId, selectedText } = req.body;
  await handleAiAction({
    req,
    res,
    actionType: 'improve_writing',
    chapterId,
    inputText: selectedText,
    run: () => improveWriting({ selectedText }),
  });
});

const expandHandler = asyncHandler(async (req, res) => {
  const { chapterId, selectedText } = req.body;
  await handleAiAction({
    req,
    res,
    actionType: 'expand',
    chapterId,
    inputText: selectedText,
    run: (story) => expand({ selectedText, storyId: story._id }),
  });
});

const shortenHandler = asyncHandler(async (req, res) => {
  const { chapterId, selectedText } = req.body;
  await handleAiAction({
    req,
    res,
    actionType: 'shorten',
    chapterId,
    inputText: selectedText,
    run: () => shorten({ selectedText }),
  });
});

const changeToneHandler = asyncHandler(async (req, res) => {
  const { chapterId, selectedText, tone } = req.body;
  await handleAiAction({
    req,
    res,
    actionType: 'change_tone',
    chapterId,
    inputText: selectedText,
    options: { tone },
    run: () => changeTone({ selectedText, tone }),
  });
});

const generateDialogueHandler = asyncHandler(async (req, res) => {
  const { chapterId, characterIds, sceneContext } = req.body;
  await handleAiAction({
    req,
    res,
    actionType: 'generate_dialogue',
    chapterId,
    inputText: sceneContext,
    options: { characterIds },
    run: () => generateDialogue({ characterIds, sceneContext }),
  });
});

module.exports = {
  continueWritingHandler,
  rewriteHandler,
  improveWritingHandler,
  expandHandler,
  shortenHandler,
  changeToneHandler,
  generateDialogueHandler,
};
