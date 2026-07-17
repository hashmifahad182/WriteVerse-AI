const { formatStructuredContext, formatRetrievedChunks } = require('../promptBuilder');

function buildChapterGenerationPrompt({
  story,
  chapterTitle,
  wordCount,
  genre,
  writingStyle,
  pov,
  instructions,
  previousChapterSummaries,
  structuredContext,
  retrievedChunks,
}) {
  return `You are writing the next chapter of a ${story.type} titled "${story.title}".

NEW CHAPTER TITLE: ${chapterTitle}
TARGET WORD COUNT: approximately ${wordCount} words
GENRE: ${genre || story.genre || 'unspecified'}
WRITING STYLE: ${writingStyle || story.writingStyle || 'match previous chapters'}
POV: ${pov || story.pov}

PREVIOUS CHAPTER SUMMARIES (in order):
${previousChapterSummaries.map((s, i) => `Chapter ${i + 1}: ${s}`).join('\n') || 'This is the first chapter.'}

${formatStructuredContext(structuredContext)}

${formatRetrievedChunks(retrievedChunks)}

${instructions ? `ADDITIONAL USER INSTRUCTIONS:\n${instructions}\n` : ''}

INSTRUCTIONS:
- Continue the story logically from where the previous chapters left off.
- Do NOT repeat previously narrated events.
- Do NOT violate any hard constraints (e.g. dead characters reappearing, location conflicts, age inconsistencies).
- Maintain consistent pacing and escalating tension appropriate to the genre.
- Write the full chapter body only — do not include a title header or meta-commentary.
- Aim for approximately ${wordCount} words.`;
}

module.exports = buildChapterGenerationPrompt;
