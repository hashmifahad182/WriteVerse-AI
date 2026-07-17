function buildChangeTonePrompt({ selectedText, tone }) {
  return `Rewrite the following passage to have a ${tone} tone. Preserve the exact events, characters, and meaning — only change the emotional register and word choice.

PASSAGE:
"""
${selectedText}
"""

Output ONLY the rewritten passage, no explanations, no preamble.`;
}

module.exports = buildChangeTonePrompt;
