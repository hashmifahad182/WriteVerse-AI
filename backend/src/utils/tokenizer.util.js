/**
 * Lightweight token estimator (no native tokenizer dependency).
 * Rule of thumb: ~4 characters per token for English text. This is
 * accurate enough for chunk-sizing decisions; it doesn't need to be
 * exact since chunk boundaries just need to be "roughly" a target size.
 */
function estimateTokens(text = '') {
  return Math.ceil(text.length / 4);
}

function estimateWordCount(text = '') {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

module.exports = { estimateTokens, estimateWordCount };
