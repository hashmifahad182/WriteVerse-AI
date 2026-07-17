const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const characterService = require('../services/character.service');
const storyService = require('../services/story.service');

const createCharacter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const character = await characterService.createCharacter(story._id, req.body);
  new ApiResponse(201, { character }, 'Character created').send(res);
});

const listCharacters = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const characters = await characterService.listCharactersForStory(story._id);
  new ApiResponse(200, { characters }).send(res);
});

const getCharacter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const character = await characterService.getCharacterById(req.params.characterId, story._id);
  new ApiResponse(200, { character }).send(res);
});

const updateCharacter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const character = await characterService.updateCharacter(req.params.characterId, story._id, req.body);
  new ApiResponse(200, { character }, 'Character updated').send(res);
});

const deleteCharacter = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  await characterService.deleteCharacter(req.params.characterId, story._id);
  new ApiResponse(200, null, 'Character deleted').send(res);
});

const markDeath = asyncHandler(async (req, res) => {
  const story = await storyService.getStoryById(req.params.storyId, req.user._id);
  const character = await characterService.markCharacterDeath(
    req.params.characterId,
    story._id,
    req.body.chapterId
  );
  new ApiResponse(200, { character }, 'Character marked as deceased').send(res);
});

module.exports = {
  createCharacter,
  listCharacters,
  getCharacter,
  updateCharacter,
  deleteCharacter,
  markDeath,
};
