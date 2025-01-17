require('dotenv').config();
const { Pool } = require('pg');

// Configuração do Pool de conexão com o banco de dados
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // SSL apenas em produção
});

// Função para criar tabelas
const createTables = async () => {
    try {
        await db.query(`
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
        console.error("Erro ao criar tabelas:", error.message);
    }
};

// Criando tabelas no início
createTables().catch(err => console.error("Erro ao criar tabelas:", err));

// Exportando a instância do banco de dados
module.exports = db;
