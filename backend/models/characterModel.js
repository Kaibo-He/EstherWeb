const db = require('./db');

const Character = {
    create: (work_id, name, name_en, cover, callback) => {
        const sql = 'INSERT INTO Characters (work_id, name, name_en, cover) VALUES (?, ?, ?, ?)';
        db.query(sql, [work_id, name, name_en, cover], callback);
    },

    getByWork: (work_id, callback) => {
        const sql = 'SELECT id, name, name_en, cover FROM Characters WHERE work_id = ? ORDER BY created_at DESC';
        db.query(sql, [work_id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM Characters WHERE id = ?';
        db.query(sql, [id], callback);
    },

    updateCover: (id, cover, callback) => {
        const sql = 'UPDATE Characters SET cover = ? WHERE id = ?';
        db.query(sql, [cover, id], callback);
    },

    updateName: (id, name, name_en, callback) => {
        const sql = 'UPDATE Characters SET name = ?, name_en = ? WHERE id = ?';
        db.query(sql, [name, name_en, id], callback);
    }
};

const CharacterDetail = {
    create: (character_id, detail, detail_en, detail_type, callback) => {
        const sql = 'INSERT INTO CharacterDetails (character_id, detail, detail_en, detail_type) VALUES (?, ?, ?, ?)';
        db.query(sql, [character_id, detail, detail_en, detail_type], callback);
    },

    getByCharacter: (character_id, callback) => {
        const sql = 'SELECT id, detail_type, detail, detail_en FROM CharacterDetails WHERE character_id = ? ORDER BY created_at ASC';
        db.query(sql, [character_id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM CharacterDetails WHERE id = ?';
        db.query(sql, [id], callback);
    },

    updateDetail: (id, detail, detail_en, callback) => {
        const sql = 'UPDATE CharacterDetails SET detail = ?, detail_en = ? WHERE id = ?';
        db.query(sql, [detail, detail_en, id], callback);
    }
};

module.exports = { Character, CharacterDetail };
