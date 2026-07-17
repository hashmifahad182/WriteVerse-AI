const express = require('express');
const router = express.Router();

const storyController = require('../controllers/story.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { createStorySchema, updateStorySchema } = require('../validators/story.validator');

router.use(protect);

router.post('/', validate(createStorySchema), storyController.createStory);
router.get('/', storyController.listStories);
router.get('/:storyId', storyController.getStory);
router.patch('/:storyId', validate(updateStorySchema), storyController.updateStory);
router.delete('/:storyId', storyController.deleteStory);

module.exports = router;
