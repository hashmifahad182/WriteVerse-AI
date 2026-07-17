function buildImproveWritingPrompt({ selectedText }) {
  return `Improve the grammar, vocabulary, readability, and flow of the following passage. Do NOT change the meaning, events, or characters — only improve the craft of the writing.

PASSAGE:
"""
${selectedText}
"""

Output ONLY the improved passage, no explanations, no preamble.`;
}

module.exports = buildImproveWritingPrompt;
