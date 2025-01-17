// const pgp = require("pg-promise")();
// const { join } = require ("node:path")
require('dotenv').config();
// const db = pgp("postgres://postgres:password@localhost:5432/infousuario");
const pgp = require('pg-promise')();
const db = pgp({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

// db.query("SELECT 1 + 1 AS result").then((result) => console.log(result))

module.exports = db
