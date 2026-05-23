// db.js

// responsabilité : connecter a la base de données avec les infos de .env. retourne un connection pool utilisé par plusieurs services.
require('dotenv').config();
const sql = require('mssql');

const config = { user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true
    }
 };

let pool;
let poolPromise;

async function getConnection() {
    if(pool) return pool;

    if (!poolPromise){
        poolPromise = sql.connect(config).then(p=>{
            pool = p;
            return pool;
        })
        .catch(err => {
            poolPromise = null;
            throw err;
        });
    }
    return poolPromise;
}

module.exports = { sql, getConnection };