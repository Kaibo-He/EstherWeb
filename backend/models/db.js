const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'EstherWeb',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit();
    }
    console.log('Connected to MySQL database.');
});

module.exports = db;
