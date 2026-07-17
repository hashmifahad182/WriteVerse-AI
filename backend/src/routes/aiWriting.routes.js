const express = require('express');
const router = express.Router({ mergeParams: true });

const aiWriting = require('../controllers/aiWriting.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');
const validate = require('../middleware/validate.middleware');
const {
  continueWritingSchema,
  rewriteSchema,
  baseSelectionSchema,
  changeToneSchema,
  dialogueSchema,
} = require('../validators/aiWriting.validator');

router.use(protect, aiLimiter);

router.post('/continue', validate(continueWritingSchema), aiWriting.continueWritingHandler);
router.post('/rewrite', validate(rewriteSchema), aiWriting.rewriteHandler);
router.post('/improve', validate(baseSelectionSchema), aiWriting.improveWritingHandler);
router.post('/expand', validate(baseSelectionSchema), aiWriting.expandHandler);
router.post('/shorten', validate(baseSelectionSchema), aiWriting.shortenHandler);
router.post('/tone', validate(changeToneSchema), aiWriting.changeToneHandler);
router.post('/dialogue', validate(dialogueSchema), aiWriting.generateDialogueHandler);

module.exports = router;
