import bcrypt from 'bcrypt';
import express from 'express';
import { body, validationResult } from 'express-validator';
import fetch from 'node-fetch'; // Adicione esta linha para importar o fetch

const userRoutes = (db) => {
    const router = express.Router();

    // Rota para criar conta
    router.post('/criar-conta', [
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
        const sql = `INSERT INTO usuarios (nome, email, senha , role) VALUES (?, ?, ? , 'user')`;
        db.query(sql, [name, email, hashedPassword], function (err, results) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Conta criada com sucesso!' });
        });
    });

    // Rota para login
    router.post('/login-conta', [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 1 }).trim().escape()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
        db.query(sql, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const user = results[0];
            if (user) {
                const match = await bcrypt.compare(password, user.senha);
                if (match) {
                    res.status(200).json({
                        message: 'Login bem-sucedido',
                        userId: user.id,
                        userName: user.nome,
                        userEmail: user.email
                    });
                } else {
                    res.status(401).json({ message: 'Senha incorreta' });
                }
            } else {
                res.status(401).json({ message: 'Usuário não encontrado' });
            }
        });
    });

    // Rota para obter informações dos usuários
    router.get('/usuarios', (req, res) => {
        const sql = 'SELECT Id, nome, email, role FROM usuarios';
        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const array = results;
            array.forEach(element => {
                console.log(element);
            });
            res.status(200).json(results);
        });
    });

    // Rota para pausar o projeto na Vercel
    router.post('/pausa-projeto', async (req, res) => {
        const projectId = 'prj_pT33YVEt55Xxb4zTdQXgE8vxIabh';
        const route = `${projectId}/pause`;

        try {
            const response = await fetch(`https://api.vercel.com/v1/projects/${route}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
                },
            });

            if (response.ok) {
                res.status(200).json({ message: 'Project paused' });
            } else {
                res.status(response.status).json({ error: 'Failed to pause project' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};

export default userRoutes;
