const express = require('express');
const router = express.Router({ mergeParams: true });

const aiChatController = require('../controllers/aiChat.controller');
const { protect } = require('../middleware/auth.middleware');
const { aiLimiter } = require('../middleware/rateLimiter.middleware');

router.use(protect);

router.post('/ask', aiLimiter, aiChatController.askQuestion);
router.get('/history', aiChatController.getChatHistory);

module.exports = router;
