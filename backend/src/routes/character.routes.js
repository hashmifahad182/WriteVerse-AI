const express = require('express');
const router = express.Router({ mergeParams: true });

const characterController = require('../controllers/character.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', characterController.createCharacter);
router.get('/', characterController.listCharacters);
router.get('/:characterId', characterController.getCharacter);
router.patch('/:characterId', characterController.updateCharacter);
router.delete('/:characterId', characterController.deleteCharacter);
router.post('/:characterId/mark-death', characterController.markDeath);

module.exports = router;
