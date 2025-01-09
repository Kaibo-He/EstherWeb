const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const { sequelize } = require('./models');
const fs = require('fs');

const workRoutes = require('./routes/workRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const characterRoutes = require('./routes/characterRoutes');

const app = express();
const port = 5000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.params.folder;
        const uploadPath = path.join(__dirname, 'uploads', folder);

        // Create path if the url does not exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        let newFileName = req.body.filename;
        const ext = path.extname(file.originalname);
        if (!newFileName) {
            const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
            newFileName = `default_${timestamp}${ext}`;
        } else {
            newFileName += ext;
        }

        cb(null, newFileName);
    },
});

const upload = multer({ storage });


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/works', workRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/characters', characterRoutes);

// Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/upload/:folder', upload.single('file'), (req, res) => {
    const folder = req.params.folder;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'File uploaded successfully',
        folder: folder,
        newFilename: file.filename,
    });
});

app.delete('/api/upload/delete', (req, res) => {
    const { path: deletePath, type } = req.body;

    if (!deletePath || !type) {
        return res.status(400).json({ error: 'Path and type are required' });
    }

    const fullPath = path.join(__dirname, 'uploads', deletePath);

    if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: 'File or folder not found' });
    }

    try {
        if (type === 'folder') {
            fs.rmSync(fullPath, { recursive: true, force: true });
            res.status(200).json({ message: 'Folder deleted successfully' });
        } else if (type === 'file') {
            fs.unlinkSync(fullPath);
            res.status(200).json({ message: 'File deleted successfully' });
        } else {
            res.status(400).json({ error: 'Invalid type. Must be "file" or "folder".' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting file or folder', details: error.message });
    }
});

app.put('/api/upload/replace/:folder', upload.single('file'), (req, res) => {
    const folder = req.params.folder;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, 'uploads', folder, file.filename);

    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); 
        }

        res.status(200).json({
            message: 'File replaced successfully',
            folder: folder,
            newFilename: file.filename,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error replacing file', details: error.message });
    }
});

app.get('/api/upload/*', (req, res) => {
    const baseDir = path.join(__dirname, 'uploads');
    const requestedPath = req.params[0];
    const filePath = path.join(baseDir, requestedPath);

    // 确保请求的路径在 baseDir 内，防止路径穿越攻击
    if (!filePath.startsWith(baseDir)) {
        return res.status(400).json({ error: 'Invalid file path' });
    }

    // 检查文件是否存在且是一个文件
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.sendFile(filePath); // 返回文件内容
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
