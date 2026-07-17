function buildExpandPrompt({ selectedText, structuredContextText }) {
  return `Expand the following passage with more sensory detail, description, and depth, while preserving its exact meaning, events, and characters. Do not introduce new characters or contradict established facts.

${structuredContextText ? structuredContextText + '\n\n' : ''}PASSAGE:
"""
${selectedText}
"""

Output ONLY the expanded passage, no explanations, no preamble.`;
}

function buildShortenPrompt({ selectedText }) {
  return `Summarize the following passage concisely while preserving all important information, events, and character actions. Do not lose critical plot details.

PASSAGE:
"""
${selectedText}
"""

Output ONLY the shortened passage, no explanations, no preamble.`;
}

module.exports = { buildExpandPrompt, buildShortenPrompt };
