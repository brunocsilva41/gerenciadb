// users.js
const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

module.exports = (db) => {
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
        const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
        db.run(sql, [name, email, hashedPassword], function (err) {
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
        db.get(sql, [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
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

    return router;
};
