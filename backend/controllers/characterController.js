const { Character, CharacterDetail } = require('../models');

const createCharacter = async (req, res) => {
    try {
        const { work_id, name, name_en, cover = "default.png" } = req.body;
        const finalNameEn = name_en || name;

        if (!work_id || !name) {
            return res.status(400).send({ error: "Missing required fields: work_id or name" });
        }

        const newCharacter = await Character.create({
            work_id,
            name,
            name_en: finalNameEn,
            cover,
        });

        res.status(201).send(newCharacter);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getCharactersByWork = async (req, res) => {
    try {
        const { work_id } = req.params;

        const characters = await Character.findAll({
            where: { work_id },
            attributes: ['id', 'name', 'name_en', 'cover'], // 仅返回需要的字段
            order: [['created_at', 'DESC']],
        });

        res.send(characters);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteCharacter = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCount = await Character.destroy({
            where: { id },
        });

        if (deletedCount === 0) {
            return res.status(404).send({ error: `Character with ID ${id} not found.` });
        }

        res.send({ message: `Character with ID ${id} deleted successfully.` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// Character details
const createCharacterDetail = async (req, res) => {
    try {
        const { character_id, detail, detail_en, detail_type } = req.body;
        const finalDetailEn = detail_en || detail;

        if (!character_id || !detail) {
            return res.status(400).send({ error: "Missing required fields: character_id or detail" });
        }

        const newCharacterDetail = await CharacterDetail.create({
            character_id,
            detail,
            detail_en: finalDetailEn,
            detail_type,
        });

        res.status(201).send(newCharacterDetail);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getCharacterDetails = async (req, res) => {
    try {
        const { character_id } = req.params;

        const details = await CharacterDetail.findAll({
            where: { character_id },
            attributes: ['id', 'detail', 'detail_en', 'detail_type'],
            order: [['created_at', 'ASC']],
        });

        res.send(details);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteCharacterDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCount = await CharacterDetail.destroy({
            where: { id },
        });

        if (deletedCount === 0) {
            return res.status(404).send({ error: `Character detail with ID ${id} not found.` });
        }

        res.send({ message: `Character detail with ID ${id} deleted successfully.` });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateCharacterCover = async (req, res) => {
    try {
        const { id } = req.params;
        const { cover } = req.body;

        if (!cover) {
            return res.status(400).send({ error: "Cover field is required" });
        }

        const [updatedCount] = await Character.update(
            { cover },
            { where: { id } }
        );

        if (updatedCount === 0) {
            return res.status(404).send({ error: `Character with ID ${id} not found.` });
        }

        res.send({ message: "Character cover updated successfully.", cover });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateCharacterName = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, name_en } = req.body;
        const finalNameEn = name_en || name;

        if (!name) {
            return res.status(400).send({ error: "Name field is required" });
        }

        const [updatedCount] = await Character.update(
            { name, name_en: finalNameEn },
            { where: { id } }
        );

        if (updatedCount === 0) {
            return res.status(404).send({ error: `Character with ID ${id} not found.` });
        }

        res.send({ message: "Character name updated successfully.", name, name_en: finalNameEn });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateCharacterDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const { detail, detail_en } = req.body;
        const finalDetailEn = detail_en || detail;

        if (!detail) {
            return res.status(400).send({ error: "Detail field is required" });
        }

        const [updatedCount] = await CharacterDetail.update(
            { detail, detail_en: finalDetailEn },
            { where: { id } }
        );

        if (updatedCount === 0) {
            return res.status(404).send({ error: `Character detail with ID ${id} not found.` });
        }

        res.send({ message: "Character detail updated successfully.", detail, detail_en: finalDetailEn });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
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