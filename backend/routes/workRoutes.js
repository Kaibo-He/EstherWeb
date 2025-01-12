const express = require('express');
const {
    createWork,
    getAllWorks,
    getWork,
    deleteWork,
    updateWorkCover,
    updateWorkCoverChar,
    updateWorkTitle
} = require('../controllers/workController');

const router = express.Router();

router.post('/', createWork);
router.get('/', getAllWorks);
router.get('/:id', getWork);
router.delete('/:id', deleteWork);
router.put('/:id/title', updateWorkTitle);
router.put('/:id/cover', updateWorkCover);
router.put('/:id/coverChar', updateWorkCoverChar);

module.exports = router;
