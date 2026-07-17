function buildRewritePrompt({ selectedText, style }) {
  return `Rewrite the following passage in a ${style} style. Preserve the core meaning, characters, and events — only change tone, word choice, and sentence construction to fit the "${style}" style.

PASSAGE:
"""
${selectedText}
"""

Output ONLY the rewritten passage, no explanations, no preamble.`;
}

module.exports = buildRewritePrompt;
