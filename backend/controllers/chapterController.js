const { Chapter, ChapterDetail } = require('../models');

const createChapter = async (req, res) => {
    try {
        const { work_id, title, title_en, cover = "default.png" } = req.body;

        if (!work_id || !title) {
            return res.status(400).send({ error: "Missing required fields: work_id or title" });
        }

        const finalTitleEn = title_en || title;

        const newChapter = await Chapter.create({
            work_id,
            title,
            title_en: finalTitleEn,
            cover,
        });

        res.status(201).send(newChapter);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getChaptersByWork = async (req, res) => {
    try {
        const { work_id } = req.params;

        const chapters = await Chapter.findAll({
            where: { work_id },
            attributes: ['id', 'title', 'title_en', 'cover'], // 仅返回需要的字段
            order: [['created_at', 'DESC']],
        });

        res.send(chapters);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteChapter = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCount = await Chapter.destroy({
            where: { id },
        });

        if (deletedCount === 0) {
            return res.status(404).send({ error: `Chapter with ID ${id} not found.` });
        }

        res.send({ message: `Chapter with ID ${id} deleted successfully.` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const createChapterDetail = async (req, res) => {
    try {
        const { chapter_id, content, content_en, content_type } = req.body;

        if (!chapter_id || !content) {
            return res.status(400).send({ error: "Missing required fields: chapter_id or content" });
        }

        const finalContentEn = content_en || content;

        const newChapterDetail = await ChapterDetail.create({
            chapter_id,
            content,
            content_en: finalContentEn,
            content_type,
        });

        res.status(201).send(newChapterDetail);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getChapterDetails = async (req, res) => {
    try {
        const { chapter_id } = req.params;

        const details = await ChapterDetail.findAll({
            where: { chapter_id },
            attributes: ['id', 'content', 'content_en', 'content_type'],
            order: [['created_at', 'ASC']],
        });

        res.send(details);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteChapterDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCount = await ChapterDetail.destroy({
            where: { id },
        });

        if (deletedCount === 0) {
            return res.status(404).send({ error: `Chapter detail with ID ${id} not found.` });
        }

        res.send({ message: `Chapter detail with ID ${id} deleted successfully.` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateChapterCover = async (req, res) => {
    try {
        const { id } = req.params;
        const { cover } = req.body;

        if (!cover) {
            return res.status(400).send({ error: "Cover field is required" });
        }

        const [updatedCount] = await Chapter.update(
            { cover },
            { where: { id } }
        );

        if (updatedCount === 0) {
            return res.status(404).send({ error: `Chapter with ID ${id} not found.` });
        }

        res.send({ message: "Chapter cover updated successfully.", cover });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateChapterTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, title_en } = req.body;

        if (!title) {
            return res.status(400).send({ error: "Title field is required" });
        }

        const finalTitleEn = title_en || title;

        const [updatedCount] = await Chapter.update(
            { title, title_en: finalTitleEn },
            { where: { id } }
        );

        if (updatedCount === 0) {
            return res.status(404).send({ error: `Chapter with ID ${id} not found.` });
        }

        res.send({ message: "Chapter title updated successfully.", title, title_en: finalTitleEn });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateChapterDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, content_en } = req.body;

        if (!content) {
            return res.status(400).send({ error: "Content field is required" });
        }

        const finalContentEn = content_en || content;

        const [updatedCount] = await ChapterDetail.update(
            { content, content_en: finalContentEn },
            { where: { id } }
        );

        if (updatedCount === 0) {
            return res.status(404).send({ error: `Chapter detail with ID ${id} not found.` });
        }

        res.send({ message: "Chapter detail updated successfully.", content, content_en: finalContentEn });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
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