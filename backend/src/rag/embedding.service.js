const { ai, GEMINI_EMBEDDING_MODEL } = require('../config/gemini.config');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');

/**
 * Generates a vector embedding for a single piece of text via Gemini's
 * embedding model. Isolated here so the RAG layer never talks to the
 * Gemini SDK directly — if we swap embedding providers later, this is
 * the only file that changes.
 *
 * Migrated to the @google/genai SDK, using the current `gemini-embedding-001`
 * model (the deprecated `text-embedding-004` model backing the old
 * @google/generative-ai SDK call is what caused the "not found for API
 * version v1beta" error).
 *
 * `taskType` lets callers hint whether the text being embedded is a
 * document chunk being indexed (RETRIEVAL_DOCUMENT, the default) or a
 * search query (RETRIEVAL_QUERY) — Gemini's embedding model produces
 * better-aligned vectors for retrieval when this is set correctly.
 */
async function embedText(text, taskType = 'RETRIEVAL_DOCUMENT') {
  try {
    const response = await ai.models.embedContent({
      model: GEMINI_EMBEDDING_MODEL,
      contents: [text],
      config: { taskType },
    });

    const embedding = response.embeddings?.[0]?.values;
    if (!embedding) {
      throw new Error('Embedding response did not contain values');
    }
    return embedding; // number[]
  } catch (err) {
    logger.error(`Embedding generation failed: ${err.message}`);
    throw ApiError.internal('Failed to generate embedding');
  }
}

/**
 * Batches embedding calls with basic concurrency control to avoid
 * hammering the API when embedding many chunks at once (e.g. on
 * initial story import or bulk re-index).
 */
async function embedBatch(texts, concurrency = 5, taskType = 'RETRIEVAL_DOCUMENT') {
  const results = new Array(texts.length);
  let cursor = 0;

  async function worker() {
    while (cursor < texts.length) {
      const index = cursor++;
      results[index] = await embedText(texts[index], taskType);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, texts.length) }, worker);
  await Promise.all(workers);
  return results;
}

module.exports = { embedText, embedBatch };
