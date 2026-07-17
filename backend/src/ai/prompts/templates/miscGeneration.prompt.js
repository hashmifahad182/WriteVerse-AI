function buildTranslatePrompt({ content, targetLanguage, characterNames }) {
  return `Translate the following text into ${targetLanguage === 'hindi' ? 'Hindi' : 'English'}. Preserve character names exactly as given, preserve the emotional tone, and preserve the author's writing style as closely as possible.

CHARACTER NAMES (do not translate these): ${characterNames.join(', ') || 'none specified'}

TEXT:
"""
${content}
"""

Output ONLY the translated text.`;
}

function buildTitleGeneratorPrompt({ genre, summary, type }) {
  return `Generate 8 creative, marketable title options for a ${type} in the ${genre || 'general'} genre, based on this summary:

"""
${summary}
"""

Output as a numbered list of titles only, no explanations.`;
}

function buildCoverPromptGeneratorPrompt({ storyTitle, genre, summary, mainCharacterDescriptions }) {
  return `Generate a detailed AI image generation prompt (suitable for Midjourney, DALL-E, or Stable Diffusion) for a book cover for "${storyTitle}", a ${genre || ''} story.

STORY SUMMARY: ${summary}

MAIN CHARACTERS: ${mainCharacterDescriptions.join('; ') || 'not specified'}

Output a single detailed image prompt (mood, composition, color palette, art style, key visual elements). Output ONLY the image prompt text.`;
}

module.exports = { buildTranslatePrompt, buildTitleGeneratorPrompt, buildCoverPromptGeneratorPrompt };
