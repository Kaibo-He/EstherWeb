const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'PersonalWebsite'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit();
    }
    console.log('Connected to MySQL database.');
});

module.exports = db;
