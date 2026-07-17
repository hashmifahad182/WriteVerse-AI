const { embedText } = require('./embedding.service');
const faissStore = require('./faissStore.service');

/**
 * Given a natural language query (or the current writing context),
 * returns the top-k most semantically relevant chunks from the story's
 * vector index. This is the "R" in RAG — used by AI Chat, Continue
 * Writing, and Story Summary features.
 */
async function retrieveRelevantChunks(storyId, query, topK = 5) {
  const queryEmbedding = await embedText(query, 'RETRIEVAL_QUERY');
  const results = await faissStore.search(storyId, queryEmbedding, topK);

  return results.map((r) => ({
    chunkId: r.id,
    text: r.text,
    score: r.score,
    chapterId: r.metadata.chapterId,
    chapterOrder: r.metadata.chapterOrder,
  }));
}

module.exports = { retrieveRelevantChunks };
