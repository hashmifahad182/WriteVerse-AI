const { v4: uuidv4 } = require('uuid');
const Story = require('../models/story.model');
const ApiError = require('../utils/apiError');

async function createStory(ownerId, payload) {
  return Story.create({ ...payload, owner: ownerId, faissIndexId: uuidv4() });
}

async function listStoriesForUser(ownerId) {
  return Story.find({ owner: ownerId }).sort({ updatedAt: -1 });
}

async function getStoryById(storyId, ownerId) {
  const story = await Story.findOne({ _id: storyId, owner: ownerId });
  if (!story) throw ApiError.notFound('Story not found');
  return story;
}

async function updateStory(storyId, ownerId, updates) {
  const story = await getStoryById(storyId, ownerId);
  Object.assign(story, updates);
  await story.save();
  return story;
}

async function softDeleteStory(storyId, ownerId) {
  const story = await getStoryById(storyId, ownerId);
  story.isDeleted = true;
  await story.save();
  return story;
}

module.exports = { createStory, listStoriesForUser, getStoryById, updateStory, softDeleteStory };
