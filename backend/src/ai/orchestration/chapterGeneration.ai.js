const { generateText } = require('../gemini/geminiGeneration');
const buildChapterGenerationPrompt = require('../prompts/templates/chapterGen.prompt');
const { buildStructuredContext } = require('../prompts/promptBuilder');
const { retrieveRelevantChunks } = require('../../rag/retrieval.service');
const Chapter = require('../../models/chapter.model');

/**
 * Orchestrates AI-powered chapter generation — the flagship feature.
 * Context strategy:
 *   1. Summaries of ALL previous chapters (cheap, bounded size)
 *   2. RAG-retrieved chunks relevant to the new chapter's theme/title
 *      (catches specific details summaries might have dropped)
 *   3. Structured character + timeline hard-constraints
 * This avoids ever sending full previous-chapter text, keeping token
 * cost roughly constant regardless of how long the story has grown.
 */
async function generateChapter({ story, chapterTitle, wordCount, genre, writingStyle, pov, instructions }) {
  const previousChapters = await Chapter.find({ story: story._id }).sort({ order: 1 });
  const previousChapterSummaries = previousChapters.map((c) => c.summary || '(no summary yet)');

  const retrievalQuery = `${chapterTitle} ${instructions || ''}`.trim() || chapterTitle;

  const [structuredContext, retrievedChunks] = await Promise.all([
    buildStructuredContext(story._id),
    retrieveRelevantChunks(story._id, retrievalQuery, 6),
  ]);

  const prompt = buildChapterGenerationPrompt({
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
  });

  // maxOutputTokens scaled roughly to requested word count (1 word ~ 1.5 tokens)
  const maxOutputTokens = Math.min(8192, Math.ceil(wordCount * 1.8));

  return generateText(prompt, { temperature: 0.85, maxOutputTokens });
}

module.exports = { generateChapter };
