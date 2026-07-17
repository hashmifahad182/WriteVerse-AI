const { generateText } = require('../gemini/geminiGeneration');
const buildRewritePrompt = require('../prompts/templates/rewrite.prompt');
const buildImproveWritingPrompt = require('../prompts/templates/improveWriting.prompt');
const { buildExpandPrompt, buildShortenPrompt } = require('../prompts/templates/expandShorten.prompt');
const buildChangeTonePrompt = require('../prompts/templates/changeTone.prompt');
const { buildStructuredContext, formatStructuredContext } = require('../prompts/promptBuilder');

/**
 * All "selection-based" editor actions (Rewrite, Improve, Expand,
 * Shorten, Change Tone) share the same simple flow: build a targeted
 * prompt from the selected text and call Gemini. Grouped in one file
 * since they're one-shot transforms with no RAG retrieval needed.
 */

async function rewrite({ selectedText, style }) {
  const prompt = buildRewritePrompt({ selectedText, style });
  return generateText(prompt, { temperature: 0.9, maxOutputTokens: 1200 });
}

async function improveWriting({ selectedText }) {
  const prompt = buildImproveWritingPrompt({ selectedText });
  return generateText(prompt, { temperature: 0.4, maxOutputTokens: 1200 });
}

async function expand({ selectedText, storyId }) {
  const structuredContext = await buildStructuredContext(storyId);
  const prompt = buildExpandPrompt({
    selectedText,
    structuredContextText: formatStructuredContext(structuredContext),
  });
  return generateText(prompt, { temperature: 0.8, maxOutputTokens: 1500 });
}

async function shorten({ selectedText }) {
  const prompt = buildShortenPrompt({ selectedText });
  return generateText(prompt, { temperature: 0.4, maxOutputTokens: 800 });
}

async function changeTone({ selectedText, tone }) {
  const prompt = buildChangeTonePrompt({ selectedText, tone });
  return generateText(prompt, { temperature: 0.85, maxOutputTokens: 1200 });
}

module.exports = { rewrite, improveWriting, expand, shorten, changeTone };
