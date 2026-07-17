const fs = require('fs/promises');
const path = require('path');
const { FAISS_STORAGE_DIR } = require('../config/env');
const logger = require('../utils/logger');

/**
 * VECTOR STORE ABSTRACTION
 * ------------------------
 * This implements a FAISS-style interface (upsert / search / delete)
 * backed by flat JSON files + brute-force cosine similarity.
 *
 * WHY NOT actual FAISS here: native FAISS bindings (faiss-node) require
 * compiled C++ dependencies that are fragile across deployment targets
 * (e.g. Render's build environment, differing Node ABI versions). For a
 * project at this scale (per-story indexes, thousands of chunks max),
 * brute-force cosine similarity is fast enough (<50ms) and has zero
 * native dependency risk.
 *
 * PRODUCTION SWAP-IN PATH: replace this file's internals with either
 * (a) faiss-node for a true ANN index per story, or
 * (b) a managed vector DB (Pinecone/Qdrant/Weaviate) — the function
 * signatures below (upsert/search/deleteByChapter) are the contract
 * the rest of the app depends on, so no other file needs to change.
 */

function storeFilePath(storyId) {
  return path.join(FAISS_STORAGE_DIR, `${storyId}.json`);
}

async function ensureStorageDir() {
  await fs.mkdir(FAISS_STORAGE_DIR, { recursive: true });
}

async function loadIndex(storyId) {
  try {
    const raw = await fs.readFile(storeFilePath(storyId), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function saveIndex(storyId, records) {
  await ensureStorageDir();
  await fs.writeFile(storeFilePath(storyId), JSON.stringify(records), 'utf-8');
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Upserts chunk records: [{ id, text, embedding, metadata }]
 */
async function upsert(storyId, records) {
  const existing = await loadIndex(storyId);
  const existingIds = new Set(existing.map((r) => r.id));
  const merged = [...existing.filter((r) => !existingIds.has(r.id)), ...records];
  await saveIndex(storyId, merged);
  logger.info(`FAISS-store: upserted ${records.length} chunks for story ${storyId}`);
  return merged.length;
}

/**
 * Returns the top-k most similar chunks to the query embedding.
 */
async function search(storyId, queryEmbedding, topK = 5) {
  const records = await loadIndex(storyId);
  if (records.length === 0) return [];

  const scored = records.map((r) => ({
    ...r,
    score: cosineSimilarity(r.embedding, queryEmbedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * Removes all chunks belonging to a specific chapter — used when a
 * chapter is edited/deleted and needs re-embedding.
 */
async function deleteByChapter(storyId, chapterId) {
  const records = await loadIndex(storyId);
  const filtered = records.filter((r) => r.metadata.chapterId !== chapterId);
  await saveIndex(storyId, filtered);
  return filtered.length;
}

module.exports = { upsert, search, deleteByChapter };
