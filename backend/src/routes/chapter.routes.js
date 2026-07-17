const express = require('express');
const router = express.Router({ mergeParams: true });

const chapterController = require('../controllers/chapter.controller');
const { generateChapterHandler } = require('../controllers/chapterGen.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createChapterSchema,
  updateChapterSchema,
  generateChapterSchema,
} = require('../validators/chapter.validator');

router.use(protect);

router.post('/', validate(createChapterSchema), chapterController.createChapter);
router.get('/', chapterController.listChapters);
router.get('/:chapterId', chapterController.getChapter);
router.patch('/:chapterId', validate(updateChapterSchema), chapterController.updateChapter);
router.delete('/:chapterId', chapterController.deleteChapter);
router.post('/:chapterId/summary', aiLimiter, chapterController.generateChapterSummary);

// AI-powered chapter generation (feature #9)
router.post('/generate', aiLimiter, validate(generateChapterSchema), generateChapterHandler);

module.exports = router;
