const express = require('express');
const authenticateToken = require('../middleware/auth');
const checkReferer = require('../middleware/checkReferer');
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

// 🔓 公开 API（获取信息）
router.get('/:work_id', checkReferer, getCharactersByWork); // 获取作品角色列表
router.get('/one/:id', checkReferer, getCharacter); // 获取单个角色
router.get('/details/:character_id', checkReferer, getCharacterDetails); // 获取角色详情列表
router.get('/details/one/:id', checkReferer, getCharacterDetail); // 获取单个角色详情

// 🔒 需要身份认证（创建、更新、删除角色）
router.post('/', authenticateToken, createCharacter); // 创建角色
router.delete('/:id', authenticateToken, deleteCharacter); // 删除角色
router.put('/:id/cover', authenticateToken, updateCharacterCover); // 修改角色封面
router.put('/:id/name', authenticateToken, updateCharacterName); // 修改角色姓名
router.put('/:id/page', authenticateToken, updateCharacterPage); // 修改角色分页

// 🔒 需要身份认证（角色详情的修改）
router.post('/details', authenticateToken, createCharacterDetail); // 创建角色详情
router.delete('/details/:id', authenticateToken, deleteCharacterDetail); // 删除角色详情
router.put('/details/:id', authenticateToken, updateCharacterDetail); // 修改角色详情

module.exports = router;
