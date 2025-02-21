const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

const workRoutes = require('./routes/workRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const characterRoutes = require('./routes/characterRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/works', workRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
