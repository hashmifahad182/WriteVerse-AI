const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const storyService = require('../services/story.service');
const { askStoryQuestion } = require('../ai/orchestration/aiChat.ai');
const { logPromptHistory } = require('../services/promptLogger.service');
const ChatHistory = require('../models/chatHistory.model');

const askQuestion = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const { question } = req.body;

  const result = await askStoryQuestion({ story, question, userId: req.user._id });

  await logPromptHistory({
    userId: req.user._id,
    storyId: story._id,
    actionType: 'story_summary', // chat re-uses RAG heavily; still logged for cost tracking
    inputText: question,
    outputText: result.text,
    tokensUsed: { input: result.inputTokens, output: result.outputTokens },
    latencyMs: result.latencyMs,
  });

  new ApiResponse(200, { answer: result.text, sources: result.retrievedChunks }).send(res);
});

const getChatHistory = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const chat = await ChatHistory.findOne({ user: req.user._id, story: story._id });
  new ApiResponse(200, { messages: chat ? chat.messages : [] }).send(res);
});

module.exports = { askQuestion, getChatHistory };
