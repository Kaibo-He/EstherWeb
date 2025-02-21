const express = require('express');
const authenticateToken = require('../middleware/auth');
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

// 🔓 公开 API（获取信息）
router.get('/', getAllWorks); // 获取作品列表
router.get('/:id', getWork); // 获取单个作品

// 🔒 需要身份认证（创建、更新、删除作品）
router.post('/', authenticateToken, createWork); // 创建作品
router.delete('/:id', authenticateToken, deleteWork); // 删除作品
router.put('/:id/title', authenticateToken, updateWorkTitle); // 更新作品标题
router.put('/:id/cover', authenticateToken, updateWorkCover); // 更新作品封面
router.put('/:id/coverChar',authenticateToken, updateWorkCoverChar); // 更新作品角色封面

module.exports = router;
