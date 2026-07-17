const Character = require('../models/character.model');

/**
 * Lightweight rule-based consistency checks, run AFTER an AI generation
 * returns, as a safety net on top of the prompt-level hard constraints.
 * This is intentionally simple pattern matching (not another AI call)
 * to keep it fast and deterministic — catches the most common failure
 * mode: a dead/gone character's name appearing in freshly generated text.
 *
 * Returns an array of warning strings; does NOT block the response,
 * since false positives are possible (e.g. a name mentioned in past
 * tense, "Sarah would have loved this"). Warnings are surfaced to the
 * user/editor for review rather than silently rewriting AI output.
 */
async function checkGeneratedTextConsistency(storyId, generatedText) {
  const warnings = [];

  const restrictedCharacters = await Character.find({
    story: storyId,
    status: { $ne: 'alive' },
  });

  for (const character of restrictedCharacters) {
    const namesToCheck = [character.name, ...(character.aliases || [])];
    for (const name of namesToCheck) {
      const regex = new RegExp(`\\b${escapeRegExp(name)}\\b`, 'i');
      if (regex.test(generatedText)) {
        warnings.push(
          `Character "${character.name}" (status: ${character.status}) appears in the generated text — verify this isn't a continuity error.`
        );
        break;
      }
    }
  }

  return warnings;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { checkGeneratedTextConsistency };
