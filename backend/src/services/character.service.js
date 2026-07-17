const Character = require('../models/character.model');
const ApiError = require('../utils/apiError');

async function createCharacter(storyId, payload) {
  return Character.create({ ...payload, story: storyId });
}

async function listCharactersForStory(storyId) {
  return Character.find({ story: storyId }).sort({ createdAt: 1 });
}

async function getCharacterById(characterId, storyId) {
  const character = await Character.findOne({ _id: characterId, story: storyId });
  if (!character) throw ApiError.notFound('Character not found');
  return character;
}

/**
 * Updates a character's fields. Deliberately does NOT allow overwriting
 * `importantFacts` wholesale via a plain PATCH — facts are appended,
 * never silently dropped, to protect the "AI should avoid changing
 * previously established character information" requirement.
 */
async function updateCharacter(characterId, storyId, updates) {
  const character = await getCharacterById(characterId, storyId);
  const { importantFacts, ...rest } = updates;

  Object.assign(character, rest);

  if (importantFacts && importantFacts.length > 0) {
    const merged = new Set([...(character.importantFacts || []), ...importantFacts]);
    character.importantFacts = Array.from(merged);
  }

  await character.save();
  return character;
}

async function deleteCharacter(characterId, storyId) {
  const character = await getCharacterById(characterId, storyId);
  await character.deleteOne();
}

async function markCharacterDeath(characterId, storyId, chapterId) {
  const character = await getCharacterById(characterId, storyId);
  character.status = 'dead';
  character.diedInChapter = chapterId;
  await character.save();
  return character;
}

module.exports = {
  createCharacter,
  listCharactersForStory,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
  markCharacterDeath,
};
