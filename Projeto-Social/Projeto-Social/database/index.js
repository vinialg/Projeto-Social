// const pgp = require("pg-promise")();
// const { join } = require ("node:path")

// const db = pgp("postgres://postgres:password@localhost:5432/infousuario");

// Configuração de conexão com o banco de dados
const pgp = require('pg-promise')();
const db = pgp({
    host: 'dpg-cu4odl1u0jms73edgnu0-a.oregon-postgres.render.com',
    port: 5432,
    database: 'infousuario',
    user: 'seila',
    password: 'l1M0YJ6JikHTMk6Lvd7rsvwUjTMSNrZz'
});

// db.query("SELECT 1 + 1 AS result").then((result) => console.log(result))

module.exports = db
