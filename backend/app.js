require('dotenv').config(); // 读取 .env 配置
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const path = require('path');

const workRoutes = require('./routes/workRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const characterRoutes = require('./routes/characterRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const checkReferer = require('./middleware/checkReferer');

const app = express();
const port = 5000;

// 数据库连接检查
sequelize.authenticate()
    .then(() => console.log('✅ Database connected successfully.'))
    .catch(err => console.error('❌ Database connection error:', err));

app.use(cors({
    origin: process.env.FRONT_DOMAIN, // 只允许你的前端访问
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', checkReferer, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/works', workRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`);
});
