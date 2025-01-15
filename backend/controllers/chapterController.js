const { Chapter, ChapterDetail } = require('../models');

const createChapter = async (req, res) => {
    try {
        const { work_id, title, title_en, cover = "defaultCha.png" } = req.body;

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
            order: [['id', 'ASC']],
        });

        res.send(chapters);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getChapter = async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await Chapter.findOne({
        where: { id }
      })
  
      if (!chapter) {
        return res.status(404).send({ error: 'chapter not found' });
      }
  
      res.send(chapter);
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

const getChapterDetail = async (req, res) => {
    try {
      const { id} = req.params;
      const chapterDetail = await ChapterDetail.findOne({
        where: { id }
      })
  
      if (!chapterDetail) {
        return res.status(404).send({ error: 'chapterDetial not found' });
      }
  
      res.send(chapterDetail);
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
            order: [['id', 'ASC']],
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

        const [updatedCount] = await Chapter.update(
            { cover },
            { where: { id } }
        );

        const exist = await Chapter.findOne({ where: { id } });
        if (!exist) {
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

        const finalTitleEn = title_en || title;

        const [updatedCount] = await Chapter.update(
            { title, title_en: finalTitleEn },
            { where: { id } }
        );

        const exist = await Chapter.findOne({ where: { id } });
        if (!exist) {
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
        const { content, content_en, content_type } = req.body;
 
        const finalContentEn = content_en || content;

        const [updatedCount] = await ChapterDetail.update(
            { content, content_en: finalContentEn, content_type },
            { where: { id } }
        );

        const exist = await ChapterDetail.findOne({ where: { id } });
        if (!exist) {
            return res.status(404).send({ error: `Chapterdetail with ID ${id} not found.` });
        }

        res.send({ message: "Chapter detail updated successfully.", content, content_en: finalContentEn });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateChapterPage = async (req, res) => {
    try {
        const { id } = req.params;
        const { page } = req.body;

        if (!Array.isArray(page)) {
            return res.status(400).send({ error: "Invalid format: 'page' must be an array of integers." });
        }

        const [updatedCount] = await Chapter.update(
            { page },
            { where: { id } }
        );

        const exist = await Chapter.findOne({ where: { id } });
        if (!exist) {
            return res.status(404).send({ error: `Chapter with ID ${id} not found.` });
        }

        res.send({ message: "Chapter page updated successfully.", page });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createChapter,
    getChaptersByWork,
    getChapter,
    deleteChapter,
    createChapterDetail,
    getChapterDetails,
    getChapterDetail,
    deleteChapterDetail,
    updateChapterCover,
    updateChapterTitle,
    updateChapterDetail,
    updateChapterPage
};