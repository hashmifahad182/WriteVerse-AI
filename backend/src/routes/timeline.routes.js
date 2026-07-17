const express = require('express');
const router = express.Router({ mergeParams: true });

const timelineController = require('../controllers/timeline.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', timelineController.createTimelineEvent);
router.get('/', timelineController.listTimeline);
router.patch('/:eventId', timelineController.updateTimelineEvent);
router.delete('/:eventId', timelineController.deleteTimelineEvent);

module.exports = router;
