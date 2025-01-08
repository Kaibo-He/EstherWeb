const db = require('./db');

const Work = {
    create: (title, title_en, cover, callback) => {
        const sql = 'INSERT INTO Works (title, title_en, cover) VALUES (?, ?)';
        db.query(sql, [title, title_en, cover], callback);
    },

    getAll: callback => {
        const sql = 'SELECT id, title, ,title_en, cover FROM Works ORDER BY created_at DESC';
        db.query(sql, callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM Works WHERE id = ?';
        db.query(sql, [id], callback);
    },

    updateTitle: (id, title, title_en, callback) => {
        const sql = 'UPDATE Works SET title = ?, title_en = ? WHERE id = ?';
        db.query(sql, [title, title_en, id], callback);
    },

    updateCover: (id, cover, callback) => {
        const sql = 'UPDATE Works SET cover = ? WHERE id = ?';
        db.query(sql, [cover, id], callback);
    }
};

module.exports = Work;
