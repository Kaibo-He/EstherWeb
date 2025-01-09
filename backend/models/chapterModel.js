const db = require('./db');

const Chapter = {
    create: (work_id, title, title_en, cover, callback) => {
        const sql = 'INSERT INTO Chapters (work_id, title, title_en, cover) VALUES (?, ?, ?, ?)';
        db.query(sql, [work_id, title, title_en, cover], callback);
    },

    getByWork: (work_id, callback) => {
        const sql = 'SELECT id, title, title_en, cover FROM Chapters WHERE work_id = ? ORDER BY created_at DESC';
        db.query(sql, [work_id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM Chapters WHERE id = ?';
        db.query(sql, [id], callback);
    },

    updateCover: (id, cover, callback) => {
        const sql = 'UPDATE Chapters SET cover = ? WHERE id = ?';
        db.query(sql, [cover, id], callback);
    },

    updateTitle: (id, title, title_en, callback) => {
        const sql = 'UPDATE Chapters SET title = ?, title_en = ? WHERE id = ?';
        db.query(sql, [title, title_en, id], callback);
    }
};

const ChapterDetail = {
    create: (chapter_id, content, content_en, content_type, callback) => {
        const sql = 'INSERT INTO ChapterDetails (chapter_id, content, content_en, content_type) VALUES (?, ?, ?, ?)';
        db.query(sql, [chapter_id, content, content_en, content_type], callback);
    },

    getByChapter: (chapter_id, callback) => {
        const sql = 'SELECT id, content_type, content, content_en FROM ChapterDetails WHERE chapter_id = ? ORDER BY created_at ASC';
        db.query(sql, [chapter_id], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM ChapterDetails WHERE id = ?';
        db.query(sql, [id], callback);
    },

    updateContent: (id, content, content_en, callback) => {
        const sql = 'UPDATE ChapterDetails SET content = ?, content_en = ? WHERE id = ?';
        db.query(sql, [content, content_en, id], callback);
    }
};

module.exports = { Chapter, ChapterDetail };