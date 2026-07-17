const { generateText } = require('../gemini/geminiGeneration');
const buildChatPrompt = require('../prompts/templates/chat.prompt');
const { retrieveRelevantChunks } = require('../../rag/retrieval.service');
const ChatHistory = require('../../models/chatHistory.model');

async function askStoryQuestion({ story, question, userId }) {
  const chatDoc = await ChatHistory.findOne({ user: userId, story: story._id });
  const chatHistory = chatDoc ? chatDoc.messages : [];

  const retrievedChunks = await retrieveRelevantChunks(story._id, question, 6);

  const prompt = buildChatPrompt({ story, question, retrievedChunks, chatHistory });
  console.log("=================================");
console.log(prompt);
console.log("=================================");
  const result = await generateText(prompt, { temperature: 0.3, maxOutputTokens: 800 });

  const chunkIds = retrievedChunks.map((c) => c.chunkId);

  await ChatHistory.findOneAndUpdate(
    { user: userId, story: story._id },
    {
      $push: {
        messages: {
          $each: [
            { role: 'user', content: question, retrievedChunkIds: [] },
            { role: 'assistant', content: result.text, retrievedChunkIds: chunkIds },
          ],
        },
      },
    },
    { upsert: true, new: true }
  );

  return { ...result, retrievedChunks };
}

module.exports = { askStoryQuestion };
