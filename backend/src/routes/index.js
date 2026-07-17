const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const storyRoutes = require('./story.routes');
const chapterRoutes = require('./chapter.routes');
const characterRoutes = require('./character.routes');
const timelineRoutes = require('./timeline.routes');
const aiWritingRoutes = require('./aiWriting.routes');
const aiChatRoutes = require('./aiChat.routes');
const exportRoutes = require('./export.routes');

router.use('/auth', authRoutes);
router.use('/stories', storyRoutes);

// Nested resources under a story — mergeParams lets these access :storyId
router.use('/stories/:storyId/chapters', chapterRoutes);
router.use('/stories/:storyId/characters', characterRoutes);
router.use('/stories/:storyId/timeline', timelineRoutes);
router.use('/stories/:storyId/ai', aiWritingRoutes);
router.use('/stories/:storyId/chat', aiChatRoutes);
router.use('/stories/:storyId', exportRoutes);

module.exports = router;
