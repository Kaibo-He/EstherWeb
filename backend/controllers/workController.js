const Work = require('../models/workModel');

const createWork = (req, res) => {
    const { title, title_en } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : null;
    const finalTitleEn = title_en || title;
    Work.create(title, finalTitleEn, cover, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, title, title_en: finalTitleEn, cover });
    });
};

const getAllWorks = (req, res) => {
    Work.getAll((err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
};

const deleteWork = (req, res) => {
    const { id } = req.params;
    Work.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Work with ID ${id} deleted successfully.` });
    });
};

const updateWorkTitle = (req, res) => {
    const { id } = req.params;
    const { title, title_en } = req.body;
    const finalTitleEn = title_en || title;
    Work.updateTitle(id, title, finalTitleEn, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Work title updated successfully.`, title, title_en: finalTitleEn });
    });
};

const updateWorkCover = (req, res) => {
    const { id } = req.params;
    const coverPath = `/uploads/${req.file.filename}`;
    Work.updateCover(id, coverPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Cover updated successfully.', cover: coverPath });
    });
};

module.exports = { createWork, getAllWorks, deleteWork, updateWorkTitle, updateWorkCover };
