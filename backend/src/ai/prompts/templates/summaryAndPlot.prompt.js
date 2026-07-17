function buildChapterSummaryPrompt({ chapterContent }) {
  return `Summarize the following chapter in 3-5 sentences, capturing all key plot events, character actions, and revelations. This summary will be used as compressed context for future AI generation, so include only what's necessary for continuity.

CHAPTER TEXT:
"""
${chapterContent}
"""

Output ONLY the summary.`;
}

function buildStorySummaryPrompt({ chapterSummaries, storyTitle }) {
  return `Write a cohesive overall summary of the story "${storyTitle}" based on these chapter summaries, in narrative order:

${chapterSummaries.map((s, i) => `Chapter ${i + 1}: ${s}`).join('\n')}

Output a 2-3 paragraph overall story summary.`;
}

function buildPlotSuggestionsPrompt({ structuredContextText, recentSummary, requestType }) {
  const typeMap = {
    plot_twist: 'three possible plot twists',
    next_chapter: 'three ideas for what could happen in the next chapter',
    side_quest: 'three side quest / subplot ideas',
    ending: 'three possible ending directions',
    cliffhanger: 'three cliffhanger ideas for the end of the current chapter',
  };

  return `Based on the story so far, suggest ${typeMap[requestType] || 'three plot ideas'}.

${structuredContextText}

RECENT STORY CONTEXT:
${recentSummary}

Provide each suggestion as a short title followed by a 1-2 sentence description. Ensure suggestions are consistent with established characters and events.`;
}

module.exports = { buildChapterSummaryPrompt, buildStorySummaryPrompt, buildPlotSuggestionsPrompt };
