import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import sqlite3 from 'sqlite3';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:8000'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./db/usuarios_banco.db', (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite!');
    }
});

// Importa o router de usuários
import userRoutes from './routes/users.js';
app.use('/api/users', userRoutes(db));

// Exporta o app para o Vercel
export default app;
