const Character = require('../../models/character.model');
const TimelineEvent = require('../../models/timeline.model');

/**
 * Builds the shared "structured context" block injected into nearly
 * every AI prompt: character facts (with hard status constraints) and
 * a compact timeline summary. This is fetched directly from MongoDB —
 * NOT via vector search — because consistency facts must be exact,
 * not "semantically similar".
 */
async function buildStructuredContext(storyId) {
  const characters = await Character.find({ story: storyId });
  const timelineEvents = await TimelineEvent.find({ story: storyId })
    .sort({ chronologicalOrder: 1 })
    .limit(50); // cap to keep prompt size bounded; older events are covered by chapter summaries

  const aliveCharacters = characters.filter((c) => c.status === 'alive');
  const deadOrGoneCharacters = characters.filter((c) => c.status !== 'alive');

  return {
    characterContext: aliveCharacters.map((c) => c.toContextBlock()),
    hardConstraints: deadOrGoneCharacters.map(
      (c) => `${c.name} is currently "${c.status}" — do NOT write them as active/speaking unless explicitly writing a flashback.`
    ),
    timelineSummary: timelineEvents.map(
      (e) => `[Order ${e.chronologicalOrder}] ${e.eventType}: ${e.title} — ${e.description || ''}`
    ),
  };
}

/**
 * Formats the structured context into a plain-text block ready to be
 * interpolated into any prompt template.
 */
function formatStructuredContext(context) {
  const parts = [];

  if (context.characterContext.length > 0) {
    parts.push('KNOWN CHARACTERS:\n' + JSON.stringify(context.characterContext, null, 2));
  }
  if (context.hardConstraints.length > 0) {
    parts.push('HARD CONSTRAINTS (must not violate):\n' + context.hardConstraints.join('\n'));
  }
  if (context.timelineSummary.length > 0) {
    parts.push('STORY TIMELINE SO FAR:\n' + context.timelineSummary.join('\n'));
  }

  return parts.join('\n\n');
}

/**
 * Formats retrieved RAG chunks into a plain-text block.
 */
function formatRetrievedChunks(chunks) {
  if (!chunks || chunks.length === 0) return '';
  return (
    'RELEVANT STORY EXCERPTS:\n' +
    chunks.map((c, i) => `[Excerpt ${i + 1}]\n${c.text}`).join('\n\n')
  );
}

module.exports = { buildStructuredContext, formatStructuredContext, formatRetrievedChunks };
