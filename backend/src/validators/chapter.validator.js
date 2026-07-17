const { z } = require('zod');

const createChapterSchema = z.object({
  title: z.string().trim().min(1).max(200),
  order: z.number().int().positive(),
  content: z.string().optional().default(''),
});

const updateChapterSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().optional(),
  status: z.enum(['draft', 'final']).optional(),
});

const generateChapterSchema = z.object({
  title: z.string().trim().min(2).max(100),
  wordCount: z.number().int().min(100).max(2000).default(500),
  genre: z.string().trim().max(100).optional(),
  writingStyle: z.string().trim().max(300).optional(),
  pov: z.enum(['first_person', 'third_person']).optional(),
  instructions: z.string().trim().max(1000).optional(),
});

module.exports = { createChapterSchema, updateChapterSchema, generateChapterSchema };
