const mysql = require("mysql2/promise");

// handling a lot of concurrent requests
const pool = mysql.createPool({
    host: 'localhost',
    database: 'blog',
    user: 'root',
    password: '1qaz2wsx_ml'
});

module.exports = pool;