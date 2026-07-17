const { z } = require('zod');

const createStorySchema = z.object({
  title: z.string().trim().min(1).max(150),
  type: z.enum(['story', 'novel', 'blog', 'script']),
  genre: z.string().trim().max(100).optional(),
  pov: z.enum(['first_person', 'third_person', 'not_applicable']).optional(),
  writingStyle: z.string().trim().max(300).optional(),
});

const updateStorySchema = createStorySchema.partial().extend({
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']).optional(),
});

module.exports = { createStorySchema, updateStorySchema };
