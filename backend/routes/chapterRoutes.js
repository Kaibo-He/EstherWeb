const express = require('express');
const multer = require('multer');
const {
    createChapter,
    getChaptersByWork,
    deleteChapter,
    createChapterDetail,
    getChapterDetails,
    deleteChapterDetail,
    updateChapterCover,
    updateChapterTitle,
    updateChapterDetail
} = require('../controllers/chapterController');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('cover'), createChapter);
router.get('/:work_id', getChaptersByWork);
router.delete('/:id', deleteChapter);
router.put('/:id/cover', upload.single('cover'), updateChapterCover);
router.put('/:id/title', updateChapterTitle);

// Chapter details
router.post('/details', createChapterDetail);
router.get('/details/:chapter_id', getChapterDetails);
router.delete('/details/:id', deleteChapterDetail);
router.put('/details/:id', updateChapterDetail);

module.exports = router;
