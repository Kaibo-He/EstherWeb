const { Chapter, ChapterDetail } = require('../models/chapterModel');

const createChapter = (req, res) => {
    const { work_id, title, title_en } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : null;
    const finalTitleEn = title_en || title;
    Chapter.create(work_id, title, finalTitleEn, cover, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, work_id, title, title_en: finalTitleEn, cover });
    });
};

const getChaptersByWork = (req, res) => {
    const { work_id } = req.params;
    Chapter.getByWork(work_id, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
};

const deleteChapter = (req, res) => {
    const { id } = req.params;
    Chapter.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Chapter with ID ${id} deleted successfully.` });
    });
};

const createChapterDetail = (req, res) => {
    const { chapter_id, content, content_en, content_type } = req.body;
    const finalContentEn = content_en || content;
    ChapterDetail.create(chapter_id, content, finalContentEn, content_type, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, chapter_id, content, content_en: finalContentEn, content_type });
    });
};

const getChapterDetails = (req, res) => {
    const { chapter_id } = req.params;
    ChapterDetail.getByChapter(chapter_id, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
};

const deleteChapterDetail = (req, res) => {
    const { id } = req.params;
    ChapterDetail.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Chapter detail with ID ${id} deleted successfully.` });
    });
};

const updateChapterCover = (req, res) => {
    const { id } = req.params;
    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;
    Chapter.updateCover(id, coverPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Chapter cover updated successfully', cover: coverPath });
    });
};

const updateChapterTitle = (req, res) => {
    const { id } = req.params;
    const { title, title_en } = req.body;
    const finalTitleEn = title_en || title;
    Chapter.updateTitle(id, title, finalTitleEn, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Chapter title updated successfully.`, title, title_en: finalTitleEn });
    });
};

const updateChapterDetail = (req, res) => {
    const { id } = req.params;
    const { content, content_en } = req.body;
    const finalContentEn = content_en || content;
    ChapterDetail.updateContent(id, content, finalContentEn, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Chapter detail updated successfully.', content, content_en: finalContentEn });
    });
};

module.exports = {
    createChapter,
    getChaptersByWork,
    deleteChapter,
    createChapterDetail,
    getChapterDetails,
    deleteChapterDetail,
    updateChapterCover,
    updateChapterTitle,
    updateChapterDetail
};