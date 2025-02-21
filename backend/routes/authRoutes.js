require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // 存储哈希密码

// 登录 API
router.post('/login', async (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: '请输入密码' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isMatch) {
        return res.status(401).json({ error: '权限认证失败' });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ isAdmin: true }, SECRET_KEY, { expiresIn: '2h' });

    res.json({ message: '登录成功', token });
});

module.exports = router;
