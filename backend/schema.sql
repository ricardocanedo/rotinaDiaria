CREATE DATABASE IF NOT EXISTS rotina_diaria;
USE rotina_diaria;

-- Tabela de rotinas
CREATE TABLE IF NOT EXISTS rotinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de atividades
CREATE TABLE IF NOT EXISTS atividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rotina_id INT NOT NULL,
    hora TIME NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rotina_id) REFERENCES rotinas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_hora_rotina (rotina_id, hora)
);

-- Índices para melhorar o desempenho das consultas
CREATE INDEX idx_rotina_id ON atividades(rotina_id);
CREATE INDEX idx_hora ON atividades(hora);

-- Inserir rotina padrão se não existir
INSERT IGNORE INTO rotinas (nome) VALUES ('Rotina Padrão');
