require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_UNAME,
    password: process.env.DB_KEY,
    database: process.env.DB_NAME,
});

if (pool) {
    console.log('✅ Database connected successfully');
} else{
    console.log('❌ Database connection failed');
}

module.exports = pool;