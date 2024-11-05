import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
dotenv.config();

const app = express();

const allowedOrigins = [
    'https://brunosilva-projetointegradorpt2.netlify.app/'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name, 
    port: process.env.db_port || 3306
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados MySQL:', err.message);
    } else {
        console.log('Conectado ao banco de dados MySQL no AWS RDS!');
    }
});

import userRoutes from './routes/users.js';
app.use('/api', userRoutes(db)); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
