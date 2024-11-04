-- Table structure for table `usuarios`

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  idade INTEGER DEFAULT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role TEXT NOT NULL
);

-- Dumping data for table `usuarios`

INSERT INTO usuarios (id, nome, idade, email, senha, data_criacao, role) 
VALUES 
(8, 'roberto', NULL, 'roberto@gmail.com', '$2b$10$.cfKoDr5U0xgvwRxJ0wAL.rKtT841jNvbhESRQgBQFE/risz7ap9O', '2024-10-26 21:13:53', 'admin'),
(15, 'Laura2', NULL, 'laura2@gmail.com', '$2b$10$zlRIF5EnqNmbFAOaHKziI.lB/2rHXW7E.Q6IrgnmYK8okQ3dLFKcC', '2024-11-02 01:02:24', 'admin');
-- Table structure for table `usuarios`

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  idade INTEGER DEFAULT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role TEXT NOT NULL
);

-- Dumping data for table `usuarios`

INSERT INTO usuarios (id, nome, idade, email, senha, data_criacao, role) 
VALUES 
(8, 'roberto', NULL, 'roberto@gmail.com', '$2b$10$.cfKoDr5U0xgvwRxJ0wAL.rKtT841jNvbhESRQgBQFE/risz7ap9O', '2024-10-26 21:13:53', 'admin'),
(15, 'Laura2', NULL, 'laura2@gmail.com', '$2b$10$zlRIF5EnqNmbFAOaHKziI.lB/2rHXW7E.Q6IrgnmYK8okQ3dLFKcC', '2024-11-02 01:02:24', 'admin');
