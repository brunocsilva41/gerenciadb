const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const cors = require('cors'); // Importar o pacote cors
const app = express();



app.use(cors({
    origin: 'http://localhost:8000'
}));
const port = process.env.DB_PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Adicione esta linha para analisar JSON


// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para criar conta
app.post('/criar-conta', [
    body('name').isLength({ min: 1 }).trim().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 3 }).trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) throw err;
        res.status(201).json({ message: 'Conta criada com sucesso!' });
        array = [];
    });}
);

// Rota para login
app.post('/login-conta', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 }).trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.query(sql, [email], async (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];
            const match = await bcrypt.compare(password, user.senha);
            if (match) {
                console.log(req.body);
                res.status(200).json({
                    message : 'teste',
                    userId: user.Id,
                    userName: user.nome ,
                    userEmail: user.email
                    
                });
            } else {
                res.status(401).json({ message: 'FALHA AO LOGAR' });
            }
        } else {
            res.status(401).json({ message: 'SENHA INVALIDA' });
        }
    });
});


// Iniciar o servidor HTTP
app.listen(3000, (err) => {
    if(err) console.log(err);
    console.log('Servidor rodando em http://localhost:3000');
});
