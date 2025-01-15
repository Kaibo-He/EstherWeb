const express = require('express');
const {
    createCharacter,
    getCharactersByWork,
    getCharacter,
    deleteCharacter,
    createCharacterDetail,
    getCharacterDetails,
    getCharacterDetail,
    deleteCharacterDetail,
    updateCharacterCover,
    updateCharacterName,
    updateCharacterDetail,
    updateCharacterPage
} = require('../controllers/characterController');

const router = express.Router();

router.post('/', createCharacter);
router.get('/:work_id', getCharactersByWork);
router.get('/one/:id', getCharacter);
router.delete('/:id', deleteCharacter);
router.put('/:id/cover', updateCharacterCover);
router.put('/:id/name', updateCharacterName);
router.put('/:id/page', updateCharacterPage);

// Character details
router.post('/details', createCharacterDetail);
router.get('/details/:character_id', getCharacterDetails);
router.get('/details/one/:id', getCharacterDetail);
router.delete('/details/:id', deleteCharacterDetail);
router.put('/details/:id', updateCharacterDetail);

module.exports = router;
