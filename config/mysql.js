import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql
.createPool({
    user: process.env.DB_USERNAME,
    host: process.env.HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})
.promise();

export default db;