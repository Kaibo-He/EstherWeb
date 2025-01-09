const db = require('./models/db');

// 测试查询
db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) throw err;
    console.log('Test Query Result:', results[0].solution);
    db.end(); // 关闭连接
});
