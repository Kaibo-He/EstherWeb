const express = require('express');
const multer = require('multer');
const {
    createWork,
    getAllWorks,
    deleteWork,
    updateWorkCover,
    updateWorkTitle
} = require('../controllers/workController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('cover'), createWork);
router.get('/', getAllWorks);
router.delete('/:id', deleteWork);
router.put('/:id/title', updateWorkTitle);
router.put('/:id/cover', upload.single('cover'), updateWorkCover);

module.exports = router;
