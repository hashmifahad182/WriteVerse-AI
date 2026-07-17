const { v4: uuidv4 } = require('uuid');
const { estimateTokens } = require('../utils/tokenizer.util');

const DEFAULT_CHUNK_TOKENS = 600; // ~500-800 token target per chunk
const DEFAULT_OVERLAP_TOKENS = 100; // overlap preserves context across chunk boundaries

/**
 * Splits chapter text into overlapping chunks along paragraph boundaries
 * where possible (better semantic coherence than a hard character cut).
 *
 * Returns an array of { id, text, tokenCount, metadata } objects ready
 * to be embedded and stored in the vector store.
 */
function chunkText(text, metadata = {}, options = {}) {
  const chunkTokens = options.chunkTokens || DEFAULT_CHUNK_TOKENS;
  const overlapTokens = options.overlapTokens || DEFAULT_OVERLAP_TOKENS;

  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks = [];
  let current = '';
  let currentTokens = 0;

  const pushChunk = () => {
    if (current.trim().length === 0) return;
    chunks.push({
      id: uuidv4(),
      text: current.trim(),
      tokenCount: estimateTokens(current),
      metadata,
    });
  };

  for (const para of paragraphs) {
    const paraTokens = estimateTokens(para);

    if (currentTokens + paraTokens > chunkTokens && current.length > 0) {
      pushChunk();
      // carry over the tail of the previous chunk as overlap for continuity
      const words = current.split(/\s+/);
      const overlapWordCount = Math.ceil((overlapTokens * 4) / 6); // rough words estimate
      current = words.slice(-overlapWordCount).join(' ');
      currentTokens = estimateTokens(current);
    }

    current += (current ? '\n\n' : '') + para;
    currentTokens += paraTokens;
  }

  pushChunk();
  return chunks;
}

module.exports = { chunkText };
