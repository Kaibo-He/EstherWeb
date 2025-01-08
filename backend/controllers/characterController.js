const { Character, CharacterDetail } = require('../models/characterModel');

const createCharacter = (req, res) => {
    const { work_id, name, name_en } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : null;
    const finalNameEn = name_en || name;
    Character.create(work_id, name, finalNameEn, cover, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, work_id, name, name_en: finalNameEn, cover });
    });
};

const getCharactersByWork = (req, res) => {
    const { work_id } = req.params;
    Character.getByWork(work_id, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
};

const deleteCharacter = (req, res) => {
    const { id } = req.params;
    Character.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Character with ID ${id} deleted successfully.` });
    });
};

// Character details
const createCharacterDetail = (req, res) => {
    const { character_id, detail, detail_en, detail_type } = req.body;
    const finalDetailEn = detail_en || detail;
    CharacterDetail.create(character_id, detail, finalDetailEn, detail_type, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, character_id, detail, detail_en: finalDetailEn, detail_type });
    });
};

const getCharacterDetails = (req, res) => {
    const { character_id } = req.params;
    CharacterDetail.getByCharacter(character_id, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
};

const deleteCharacterDetail = (req, res) => {
    const { id } = req.params;
    CharacterDetail.delete(id, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Character detail with ID ${id} deleted successfully.` });
    });
};

const updateCharacterCover = (req, res) => {
    const { id } = req.params;
    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;
    Character.updateCover(id, coverPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Character cover updated successfully', cover: coverPath });
    });
};

const updateCharacterName = (req, res) => {
    const { id } = req.params;
    const { name, name_en } = req.body;
    const finalNameEn = name_en || name;
    Character.updateName(id, name, finalNameEn, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: `Character name updated successfully.`, name, name_en: finalNameEn });
    });
};

const updateCharacterDetail = (req, res) => {
    const { id } = req.params;
    const { detail, detail_en } = req.body;
    const finalDetailEn = detail_en || detail;
    CharacterDetail.updateDetail(id, detail, finalDetailEn, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Character detail updated successfully.', detail, detail_en: finalDetailEn });
    });
};

module.exports = {
    createCharacter,
    getCharactersByWork,
    deleteCharacter,
    createCharacterDetail,
    getCharacterDetails,
    deleteCharacterDetail,
    updateCharacterCover,
    updateCharacterName,
    updateCharacterDetail
};