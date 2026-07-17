const { formatRetrievedChunks } = require('../promptBuilder');

function buildChatPrompt({ story, question, retrievedChunks, chatHistory }) {
  const historyText = (chatHistory || [])
    .slice(-6) // last 6 turns keeps prompt bounded
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');

  return `You are answering questions about the ${story.type} "${story.title}" based ONLY on the excerpts provided below. If the answer isn't in the excerpts, say you're not certain rather than inventing details.

${formatRetrievedChunks(retrievedChunks)}

${historyText ? `RECENT CONVERSATION:\n${historyText}\n` : ''}

USER QUESTION: ${question}

Answer concisely and accurately, citing chapter context where relevant. Output ONLY the answer.`;
}

module.exports = buildChatPrompt;
