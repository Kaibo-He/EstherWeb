const express = require('express');
const authenticateToken = require('../middleware/auth');
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
    updateChapterDetail,
    updateChapterPage
} = require('../controllers/chapterController');

const router = express.Router();

// 🔓 公开 API（获取信息）
router.get('/:work_id', getChaptersByWork); // 获取作品章节列表
router.get('/one/:id', getChapter); // 获取单个章节信息
router.get('/details/:chapter_id', getChapterDetails); // 获取章节内容列表
router.get('/details/one/:id', getChapterDetail); // 获取单个章节内容

// 🔒 需要身份认证（创建、更新、删除章节）
router.post('/', authenticateToken, createChapter); // 创建章节
router.delete('/:id', authenticateToken, deleteChapter); // 删除章节
router.put('/:id/cover', authenticateToken, updateChapterCover); // 修改章节封面
router.put('/:id/title', authenticateToken, updateChapterTitle); // 修改章节标题
router.put('/:id/page', authenticateToken, updateChapterPage); // 修改章节分页

// 🔒 需要身份认证（章节详情的修改）
router.post('/details', authenticateToken, createChapterDetail); // 创建章节详情
router.delete('/details/:id', authenticateToken, deleteChapterDetail); // 删除章节详情
router.put('/details/:id', authenticateToken, updateChapterDetail); // 修改章节详情

module.exports = router;
