const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const path = require('path');
const fs = require('fs');
const authenticateToken = require('../middleware/auth'); // 认证中间件

// 设置上传目录（确保路径正确）
const UPLOADS_DIR = path.join(__dirname, "../uploads"); // 确保所有文件存储在 `backend/uploads/`

// 确保 `uploads` 目录存在
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// 规范化路径 & 处理路径不存在情况
const normalizeUploadPath = (uploadPath) => {
    if (!uploadPath) return ""; // 避免 undefined

    if (uploadPath === "uploads") {
        uploadPath = "";
    }

    // 移除 `uploads/` 前缀，确保路径合法
    if (uploadPath.startsWith("uploads/")) {
        uploadPath = uploadPath.replace(/^uploads\//, "");
    }

    // **防止路径逃逸攻击**
    if (uploadPath.includes("..")) {
        throw new Error("Invalid path");
    }

    return uploadPath;
};

// POST /api/upload: 上传文件到指定路径，如路径不存在则创建路径
router.post('/', authenticateToken, (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        try {
            // 获取字段和文件
            let uploadPath = fields.path?.[0];
            const fileName = fields.name?.[0];
            const file = files.file?.[0];

            if (!uploadPath || !fileName || !file) {
                return res.status(400).json({ error: 'Path, name, and file are required' });
            }

            // **修正 `uploads/uploads/` 问题**
            uploadPath = normalizeUploadPath(uploadPath);
            const targetDir = path.join(UPLOADS_DIR, uploadPath);

            // 创建目录
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            // 保存文件
            const destPath = path.join(targetDir, fileName + path.extname(file.originalFilename));

            // 使用 copyAndRemove 替代 rename
            await fs.promises.copyFile(file.path, destPath);
            await fs.promises.unlink(file.path);

            res.status(200).json({ message: 'File uploaded successfully', filePath: `/uploads/${uploadPath}/${fileName}${path.extname(file.originalFilename)}` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

// PUT /api/upload: 替换指定路径的文件
router.put('/', authenticateToken, (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        try {
            let uploadPath = fields.path?.[0];
            const fileName = fields.name?.[0];
            const file = files.file?.[0];

            if (!uploadPath || !fileName || !file) {
                return res.status(400).json({ error: 'Path, name, and file are required' });
            }

            uploadPath = normalizeUploadPath(uploadPath);
            const targetDir = path.join(UPLOADS_DIR, uploadPath);

            // 创建目录（如果不存在）
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const newFileExt = path.extname(file.originalFilename);
            const baseFileName = fileName; // 不含扩展名的文件名
            const newFilePath = path.join(targetDir, `${baseFileName}${newFileExt}`);

            // 查找现有的同名文件（不同扩展名也算）
            const existingFiles = fs.readdirSync(targetDir).filter((f) => {
                return path.basename(f, path.extname(f)) === baseFileName;
            });

            // 删除所有同名文件（无论扩展名）
            for (const existingFile of existingFiles) {
                fs.unlinkSync(path.join(targetDir, existingFile));
            }

            // 保存新文件
            await fs.promises.copyFile(file.path, newFilePath);
            await fs.promises.unlink(file.path);

            res.status(200).json({ message: 'File replaced successfully', filePath: newFilePath });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

// PUT /api/upload: 删除指定路径以及下面的文件
router.put('/', authenticateToken, (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        try {
            let uploadPath = fields.path?.[0];
            // const targetPath = fields.path?.[0]; // 要删除的目标路径

            if (!uploadPath) {
                return res.status(400).json({ error: 'Path is required' });
            }

            uploadPath = normalizeUploadPath(uploadPath);
            const fullPath = path.join(UPLOADS_DIR, uploadPath);

            if (!fs.existsSync(fullPath)) {
                return res.status(404).json({ error: 'Directory not found' });
            }

            // 防止删除 `uploads/` 根目录
            if (fullPath === UPLOADS_DIR) {
                return res.status(400).json({ error: "Cannot delete root uploads directory" });
            }

            fs.rmSync(fullPath, { recursive: true, force: true });
            res.status(200).json({ message: 'Directory and its contents deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

// PUT /api/upload/one：删除指定文件
router.put('/one', authenticateToken, (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        try {
            let uploadPath = fields.path?.[0];
            const fileName = fields.name?.[0];

            if (!uploadPath || !fileName) {
                return res.status(400).json({ error: 'Path and name are required' });
            }

            uploadPath = normalizeUploadPath(uploadPath);
            const targetDir = path.join(UPLOADS_DIR, uploadPath);

            if (!fs.existsSync(targetDir)) {
                return res.status(404).json({ error: 'Specified path does not exist' });
            }

            // 查找匹配的文件
            const matchingFiles = fs.readdirSync(targetDir).filter((file) => {
                return path.basename(file, path.extname(file)) === fileName;
            });

            if (matchingFiles.length === 0) {
                return res.status(404).json({ error: 'No matching files found' });
            }

            // 删除匹配的文件
            for (const file of matchingFiles) {
                fs.unlinkSync(path.join(targetDir, file));
            }

            res.status(200).json({ message: 'File(s) deleted successfully', deletedFiles: matchingFiles });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
});

module.exports = router;
