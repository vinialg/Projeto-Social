// const pgp = require("pg-promise")();
// const { join } = require ("node:path")

// const db = pgp("postgres://postgres:password@localhost:5432/infousuario");

// Configuração de conexão com o banco de dados
// const pgp = require('pg-promise')();
const db = pgp("postgresql://seila:l1M0YJ6JikHTMk6Lvd7rsvwUjTMSNrZz@dpg-cu4odl1u0jms73edgnu0-a.virginia-postgres.render.com/infousuario");
const db = pgp({
    host: '127.0.0.1',
    port: 5432,
    database: 'infousuario',
    user: 'seila',
    password: 'l1M0YJ6JikHTMk6Lvd7rsvwUjTMSNrZz'
});

// db.query("SELECT 1 + 1 AS result").then((result) => console.log(result))

const createTables = async () => {
    try {
        await db.none(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS sessions (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("Tabelas criadas com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabelas:", error);
    }
};

createTables();

module.exports = db
