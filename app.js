import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados MySQL:', err.message);
    } else {
        console.log('Conectado ao banco de dados MySQL no AWS RDS!');
    }
});
app.post('/api/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});


// Importa o router de usuários
import userRoutes from './routes/users.js';
app.use('/api/users', userRoutes(db));

// Exporta o app para o Vercel
export default app;
