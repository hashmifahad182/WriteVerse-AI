const { chunkText } = require('./chunking.service');
const { embedBatch } = require('./embedding.service');
const faissStore = require('./faissStore.service');
const Chapter = require('../models/chapter.model');
const logger = require('../utils/logger');

/**
 * Full index pipeline for a single chapter: chunk -> embed -> store.
 * Called after a chapter is created/updated (typically debounced from
 * auto-save, not on every keystroke).
 */
async function indexChapter(storyId, chapter) {
  const chunks = chunkText(chapter.content, {
    chapterId: chapter._id.toString(),
    chapterOrder: chapter.order,
    chapterTitle: chapter.title,
  });

  if (chunks.length === 0) return;

  // remove stale chunks from a previous version of this chapter first
  await faissStore.deleteByChapter(storyId, chapter._id.toString());

  const embeddings = await embedBatch(chunks.map((c) => c.text));

  const records = chunks.map((chunk, i) => ({
    id: chunk.id,
    text: chunk.text,
    embedding: embeddings[i],
    metadata: chunk.metadata,
  }));

  await faissStore.upsert(storyId, records);

  await Chapter.findByIdAndUpdate(chapter._id, {
    isEmbedded: true,
    lastEmbeddedAt: new Date(),
  });

  logger.info(`Indexed chapter ${chapter._id} (${chunks.length} chunks) for story ${storyId}`);
}

/**
 * Re-indexes every chapter of a story — used on initial import or
 * a manual "rebuild index" action.
 */
async function reindexStory(storyId) {
  const chapters = await Chapter.find({ story: storyId });
  for (const chapter of chapters) {
    // eslint-disable-next-line no-await-in-loop
    await indexChapter(storyId, chapter);
  }
}

module.exports = { indexChapter, reindexStory };
