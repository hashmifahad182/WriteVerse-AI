const express = require('express');
const router = express.Router({ mergeParams: true });

const exportController = require('../controllers/export.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');

router.use(protect, aiLimiter);

router.post('/translate', exportController.translate);
router.post('/titles', exportController.generateTitleOptions);
router.post('/cover-prompt', exportController.generateCover);
router.get('/summary', exportController.getStorySummary);
router.get('/plot-suggestions', exportController.getPlotSuggestions);

module.exports = router;
