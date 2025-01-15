const express = require('express');
const cors = require('cors');
const multiparty = require('multiparty');
const bodyParser = require('body-parser');
const path = require('path');
const { sequelize } = require('./models');
const fs = require('fs');

const workRoutes = require('./routes/workRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const characterRoutes = require('./routes/characterRoutes');

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


app.post('/api/upload', (req, res) => {
    const form = new multiparty.Form();
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      try {
        // 获取字段和文件
        const uploadPath = fields.path?.[0];
        const fileName = fields.name?.[0];
        const file = files.file?.[0];
        console.log(file.originalFilename)
  
        if (!uploadPath || !fileName || !file) {
          return res.status(400).json({ error: 'Path, name, and file are required' });
        }
  
        // 创建目录
        const fullPath = path.resolve(uploadPath);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
  
        // 保存文件
        const relativePath = path.join(uploadPath, fileName + path.extname(file.originalFilename)); // 相对路径
        const destPath = path.join(fullPath, fileName + path.extname(file.originalFilename));
        
        // 使用 copyAndRemove 替代 rename
        await new Promise((resolve, reject) => {
          fs.copyFile(file.path, destPath, (err) => {
            if (err) return reject(err);
            fs.unlink(file.path, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        });
  
        res.status(200).json({
          message: 'File uploaded successfully',
          filePath: relativePath,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });

// PUT /api/upload: 替换指定路径的文件
app.put('/api/upload', (req, res) => {
    const form = new multiparty.Form();
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      try {
        const uploadPath = fields.path?.[0];
        const fileName = fields.name?.[0];
        const file = files.file?.[0];
  
        if (!uploadPath || !fileName || !file) {
          return res.status(400).json({ error: 'Path, name, and file are required' });
        }
  
        const fullPath = path.resolve(uploadPath);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
  
        const newFileExt = path.extname(file.originalFilename);
        const baseFileName = fileName; // 不含扩展名的文件名
        const newFilePath = path.join(fullPath, `${baseFileName}${newFileExt}`);
  
        // 查找现有的同名文件（不同扩展名也算）
        const existingFiles = fs.readdirSync(fullPath).filter((f) => {
          return path.basename(f, path.extname(f)) === baseFileName;
        });
  
        // 删除所有同名文件（无论扩展名）
        for (const existingFile of existingFiles) {
          const existingFilePath = path.join(fullPath, existingFile);
          fs.unlinkSync(existingFilePath);
        }
  
        // 保存新文件
        await new Promise((resolve, reject) => {
          fs.copyFile(file.path, newFilePath, (err) => {
            if (err) return reject(err);
            fs.unlink(file.path, (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
        });
  
        res.status(200).json({
          message: 'File replaced successfully',
          filePath: newFilePath,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });
  
// DELETE /api/upload: 删除指定路径以及下面的文件
app.delete('/api/upload', (req, res) => {
    const form = new multiparty.Form();
  
    form.parse(req, (err, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      try {
        const targetPath = fields.path?.[0]; // 要删除的目标路径

        if (!targetPath) {
          return res.status(400).json({ error: 'Path is required' });
        }
  
        const fullPath = path.resolve(targetPath);
  
        // 检查目标路径是否存在
        if (!fs.existsSync(fullPath)) {
          return res.status(404).json({ error: 'Path or file not found' });
        }
  
        const stats = fs.lstatSync(fullPath);
        if (stats.isDirectory()) {
          // 递归删除目录及其内容
          fs.rmdirSync(fullPath, { recursive: true });
          res.status(200).json({ message: 'Directory and its contents deleted successfully' });
        } else {
          res.status(400).json({ error: 'Invalid path type' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });

// DELETE /api/upload/one：删除指定文件
app.delete('/api/upload/one', (req, res) => {
    console.log('DELETE request received:', req.body);
    const form = new multiparty.Form();
  
    form.parse(req, (err, fields) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      try {
        const uploadPath = fields.path?.[0];
        const fileName = fields.name?.[0];
  
        if (!uploadPath || !fileName) {
          return res.status(400).json({ error: 'Path and name are required' });
        }
  
        const fullPath = path.resolve(uploadPath);
  
        if (!fs.existsSync(fullPath)) {
          return res.status(404).json({ error: 'Specified path does not exist' });
        }
  
        // 查找匹配的文件
        const matchingFiles = fs.readdirSync(fullPath).filter((file) => {
          return path.basename(file, path.extname(file)) === fileName;
        });
  
        if (matchingFiles.length === 0) {
          return res.status(404).json({ error: 'No matching files found' });
        }
  
        // 删除匹配的文件
        for (const file of matchingFiles) {
          const filePath = path.join(fullPath, file);
          fs.unlinkSync(filePath);
        }
  
        res.status(200).json({
          message: 'File(s) deleted successfully',
          deletedFiles: matchingFiles,
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
