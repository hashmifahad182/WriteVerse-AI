const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const storyService = require('../services/story.service');

const createStory = asyncHandler(async (req, res) => {
  const story = await storyService.createStory(req.user._id, req.body);
  new ApiResponse(201, { story }, 'Story created').send(res);
});

const listStories = asyncHandler(async (req, res) => {
  const stories = await storyService.listStoriesForUser(req.user._id);
  new ApiResponse(200, { stories }).send(res);
});

const getStory = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  new ApiResponse(200, { story }).send(res);
});

const updateStory = asyncHandler(async (req, res) => {
  const story = await storyService.updateStory(req.params.storyId, req.user._id, req.body);
  new ApiResponse(200, { story }, 'Story updated').send(res);
});

const deleteStory = asyncHandler(async (req, res) => {
  await storyService.softDeleteStory(req.params.storyId, req.user._id);
  new ApiResponse(200, null, 'Story deleted').send(res);
});

module.exports = { createStory, listStories, getStory, updateStory, deleteStory };
