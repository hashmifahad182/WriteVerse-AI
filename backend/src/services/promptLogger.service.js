const PromptHistory = require('../models/promptHistory.model');
const logger = require('../utils/logger');

/**
 * Logs every AI action for observability, cost tracking, and debugging.
 * Never throws — a logging failure must not break the actual AI response
 * the user is waiting on.
 */
async function logPromptHistory({
  userId,
  storyId,
  chapterId,
  actionType,
  inputText,
  options,
  outputText,
  tokensUsed,
  latencyMs,
  status = 'success',
  errorMessage,
}) {
  try {
    await PromptHistory.create({
      user: userId,
      story: storyId,
      chapter: chapterId,
      actionType,
      inputText,
      options,
      outputText,
      tokensUsed,
      latencyMs,
      status,
      errorMessage,
    });
  } catch (err) {
    logger.warn(`Failed to log prompt history: ${err.message}`);
  }
}

module.exports = { logPromptHistory };
