const express = require('express');
const multer = require('multer');
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
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('cover'), createCharacter);
router.get('/:work_id', getCharactersByWork);
router.delete('/:id', deleteCharacter);
router.put('/:id/cover', upload.single('cover'), updateCharacterCover);
router.put('/:id/name', updateCharacterName);

// Character details
router.post('/details', createCharacterDetail);
router.get('/details/:character_id', getCharacterDetails);
router.delete('/details/:id', deleteCharacterDetail);
router.put('/details/:id', updateCharacterDetail);

module.exports = router;
