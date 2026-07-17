function buildDialoguePrompt({ characters, sceneContext }) {
  const characterProfiles = characters
    .map(
      (c) =>
        `${c.name} — personality: ${c.personality || 'unspecified'}; speaking style: ${c.speakingStyle || 'unspecified'}; relationships: ${
          (c.relationships || []).map((r) => `${r.relationType} to another character`).join(', ') || 'none noted'
        }`
    )
    .join('\n');

  return `Generate a realistic dialogue scene between the following characters, staying strictly true to each character's personality and speaking style.

CHARACTERS:
${characterProfiles}

SCENE CONTEXT:
"""
${sceneContext}
"""

INSTRUCTIONS:
- Each character must speak in a way consistent with their established personality and speaking style.
- Use proper dialogue formatting with dialogue tags.
- Do not resolve major plot points unless the scene context calls for it.
- Output ONLY the dialogue scene, no explanations, no preamble.`;
}

module.exports = buildDialoguePrompt;
