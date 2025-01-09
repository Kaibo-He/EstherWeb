const express = require('express');
const {
    createCharacter,
    getCharactersByWork,
    deleteCharacter,
    createCharacterDetail,
    getCharacterDetails,
    deleteCharacterDetail,
    updateCharacterCover,
    updateCharacterName,
    updateCharacterDetail
} = require('../controllers/characterController');

const router = express.Router();

router.post('/', createCharacter);
router.get('/:work_id', getCharactersByWork);
router.delete('/:id', deleteCharacter);
router.put('/:id/cover', updateCharacterCover);
router.put('/:id/name', updateCharacterName);

// Character details
router.post('/details', createCharacterDetail);
router.get('/details/:character_id', getCharacterDetails);
router.delete('/details/:id', deleteCharacterDetail);
router.put('/details/:id', updateCharacterDetail);

module.exports = router;
