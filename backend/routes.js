// backend/routes.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

// Rotas para Rotinas
router.get("/rotinas", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM rotinas ORDER BY nome ASC");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar rotinas:", error);
    res.status(500).json({ error: "Erro ao buscar rotinas" });
  }
});

router.post("/rotinas", async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: "Nome da rotina é obrigatório" });
  }
  
  try {
    const [result] = await pool.query(
      "INSERT INTO rotinas (nome) VALUES (?)",
      [nome]
    );
    res.status(201).json({ id: result.insertId, nome });
  } catch (error) {
    console.error("Erro ao criar rotina:", error);
    res.status(500).json({ error: "Erro ao criar rotina" });
  }
});

// Rotas para Atividades
router.get("/rotinas/:rotinaId/atividades", async (req, res) => {
  const { rotinaId } = req.params;
  
  try {
    const [rows] = await pool.query(
      "SELECT * FROM atividades WHERE rotina_id = ? ORDER BY hora ASC",
      [rotinaId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    res.status(500).json({ error: "Erro ao buscar atividades" });
  }
});

router.post("/rotinas/:rotinaId/atividades", async (req, res) => {
  const { rotinaId } = req.params;
  const { hora, titulo } = req.body;
  
  if (!hora || !titulo) {
    return res.status(400).json({ error: "Hora e título são obrigatórios" });
  }
  
  try {
    // Verifica se já existe uma atividade neste horário
    const [existing] = await pool.query(
      "SELECT id FROM atividades WHERE rotina_id = ? AND hora = ?",
      [rotinaId, hora]
    );
    
    if (existing.length > 0) {
      // Atualiza a atividade existente
      await pool.query(
        "UPDATE atividades SET titulo = ? WHERE id = ?",
        [titulo, existing[0].id]
      );
      return res.json({ id: existing[0].id, hora, titulo });
    } else {
      // Cria uma nova atividade
      const [result] = await pool.query(
        "INSERT INTO atividades (rotina_id, hora, titulo) VALUES (?, ?, ?)",
        [rotinaId, hora, titulo]
      );
      return res.status(201).json({ id: result.insertId, hora, titulo });
    }
  } catch (error) {
    console.error("Erro ao salvar atividade:", error);
    res.status(500).json({ error: "Erro ao salvar atividade" });
  }
});

router.delete("/rotinas/:rotinaId/atividades/:atividadeId", async (req, res) => {
  const { rotinaId, atividadeId } = req.params;
  
  try {
    await pool.query(
      "DELETE FROM atividades WHERE id = ? AND rotina_id = ?",
      [atividadeId, rotinaId]
    );
    res.json({ message: "Atividade removida com sucesso" });
  } catch (error) {
    console.error("Erro ao remover atividade:", error);
    res.status(500).json({ error: "Erro ao remover atividade" });
  }
});

module.exports = router;
