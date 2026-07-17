const Chapter = require('../models/chapter.model');
const Story = require('../models/story.model');
const ApiError = require('../utils/apiError');
const { estimateWordCount } = require('../utils/tokenizer.util');
const { indexChapter } = require('../rag/ragPipeline');
const faissStore = require('../rag/faissStore.service');

async function createChapter(storyId, payload) {
  const wordCount = estimateWordCount(payload.content);
  const chapter = await Chapter.create({ ...payload, story: storyId, wordCount });
  await recalculateStoryWordCount(storyId);
  return chapter;
}

async function listChaptersForStory(storyId) {
  return Chapter.find({ story: storyId }).sort({ order: 1 });
}

async function getChapterById(chapterId, storyId) {
  const chapter = await Chapter.findOne({ _id: chapterId, story: storyId });
  if (!chapter) throw ApiError.notFound('Chapter not found');
  return chapter;
}

async function updateChapter(chapterId, storyId, updates) {
  
  console.log("==================================");
  console.log("UPDATE CALLED");
  console.log("chapter:", chapterId);
  console.log("story:", storyId);

  if (updates.content) {
      console.log(updates.content.substring(0,100));
  }

  console.log("==================================");

  
  const chapter = await getChapterById(chapterId, storyId);
  
  Object.assign(chapter, updates);

  if (updates.content !== undefined) {
    chapter.wordCount = estimateWordCount(updates.content);
    chapter.isEmbedded = false; // mark stale — needs re-indexing
  }

  await chapter.save();
  await recalculateStoryWordCount(storyId);

  // Fire-and-forget re-indexing so auto-save stays fast; in production
  // this would be pushed to a background job queue (e.g. BullMQ).
  if (updates.content !== undefined) {
    indexChapter(storyId, chapter).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Background re-indexing failed:', err.message);
    });
  }

  return chapter;
}

async function deleteChapter(chapterId, storyId) {
  const chapter = await getChapterById(chapterId, storyId);
  await faissStore.deleteByChapter(storyId, chapterId);
  await chapter.deleteOne();
  await recalculateStoryWordCount(storyId);
}

async function recalculateStoryWordCount(storyId) {
  const chapters = await Chapter.find({ story: storyId }).select('wordCount');
  const total = chapters.reduce((sum, c) => sum + (c.wordCount || 0), 0);
  await Story.findByIdAndUpdate(storyId, { wordCount: total });
}

module.exports = {
  createChapter,
  listChaptersForStory,
  getChapterById,
  updateChapter,
  deleteChapter,
};
