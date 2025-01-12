const express = require('express');
const {
    createChapter,
    getChaptersByWork,
    getChapter,
    deleteChapter,
    createChapterDetail,
    getChapterDetails,
    getChapterDetail,
    deleteChapterDetail,
    updateChapterCover,
    updateChapterTitle,
    updateChapterDetail
} = require('../controllers/chapterController');

const router = express.Router();

router.post('/', createChapter);
router.get('/:work_id', getChaptersByWork);
router.get('/one/:id', getChapter);
router.delete('/:id', deleteChapter);
router.put('/:id/cover', updateChapterCover);
router.put('/:id/title', updateChapterTitle);

// Chapter details
router.post('/details', createChapterDetail);
router.get('/details/:chapter_id', getChapterDetails);
router.get('/details/one/:id', getChapterDetail);
router.delete('/details/:id', deleteChapterDetail);
router.put('/details/:id', updateChapterDetail);

module.exports = router;
