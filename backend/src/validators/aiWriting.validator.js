const { z } = require('zod');

const baseSelectionSchema = z.object({
  chapterId: z.string().min(1),
  selectedText: z.string().min(1, 'Selected text is required'),
});

const continueWritingSchema = z.object({
  chapterId: z.string().min(1),
  cursorContext: z.string().min(1, 'Preceding text is required'),
});

const rewriteSchema = baseSelectionSchema.extend({
  style: z.enum(['professional', 'emotional', 'thriller', 'horror', 'romantic', 'funny']),
});

const changeToneSchema = baseSelectionSchema.extend({
  tone: z.enum(['formal', 'friendly', 'academic', 'poetic', 'dark', 'mystery']),
});

const dialogueSchema = z.object({
  chapterId: z.string().min(1),
  characterIds: z.array(z.string()).min(2, 'At least two characters are required'),
  sceneContext: z.string().min(1),
});

const translateSchema = z.object({
  chapterId: z.string().min(1),
  targetLanguage: z.enum(['hindi', 'english']),
});

module.exports = {
  baseSelectionSchema,
  continueWritingSchema,
  rewriteSchema,
  changeToneSchema,
  dialogueSchema,
  translateSchema,
};
