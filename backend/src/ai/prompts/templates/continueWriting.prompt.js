const { formatStructuredContext, formatRetrievedChunks } = require('../promptBuilder');

function buildContinueWritingPrompt({ structuredContext, retrievedChunks, cursorContext, story }) {
  return `You are a professional ghostwriter continuing a ${story.type} titled "${story.title}".
Genre: ${story.genre || 'unspecified'}. Writing style: ${story.writingStyle || 'match the existing prose'}. POV: ${story.pov}.

${formatStructuredContext(structuredContext)}

${formatRetrievedChunks(retrievedChunks)}

TEXT WRITTEN SO FAR (continue directly from here, do not repeat it):
"""
${cursorContext}
"""

INSTRUCTIONS:
- Continue the narrative naturally from the exact point it stops.
- Maintain the established tone, pacing, and character voices.
- Do NOT contradict any hard constraints or established character facts above.
- Do NOT restate or summarize what has already happened.
- Write 2-4 paragraphs only.
- Output ONLY the continuation text, no preamble, no explanations.`;
}

module.exports = buildContinueWritingPrompt;
