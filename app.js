// app.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:8000'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./db/novo_banco.db', (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite!');
    }
});

// Importa o router de usuários
const userRoutes = require('./routes/users')(db); // Passa o `db` para o router de usuários
app.use('/api/users', userRoutes); // Define o prefixo para as rotas de usuários

// Inicializa o servidor
const port = process.env.DB_PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
