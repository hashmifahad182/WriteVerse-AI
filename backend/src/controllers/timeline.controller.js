const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const timelineService = require('../services/timeline.service');
const storyService = require('../services/story.service');

const createTimelineEvent = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const warnings = await timelineService.detectContradictions(story._id, req.body);
  const event = await timelineService.createTimelineEvent(story._id, req.body);
  new ApiResponse(201, { event, warnings }, 'Timeline event created').send(res);
});

const listTimeline = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const events = await timelineService.listTimelineForStory(story._id);
  new ApiResponse(200, { events }).send(res);
});

const updateTimelineEvent = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const event = await timelineService.updateTimelineEvent(req.params.eventId, story._id, req.body);
  new ApiResponse(200, { event }, 'Timeline event updated').send(res);
});

const deleteTimelineEvent = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  await timelineService.deleteTimelineEvent(req.params.eventId, story._id);
  new ApiResponse(200, null, 'Timeline event deleted').send(res);
});

module.exports = { createTimelineEvent, listTimeline, updateTimelineEvent, deleteTimelineEvent };
