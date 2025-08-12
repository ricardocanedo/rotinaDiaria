// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configuração de middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
const routes = require("./routes");
app.use("/api", routes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("API Rotina Diária está funcionando!");
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
  console.log(`Banco de dados: ${process.env.DB_NAME || 'rotina_diaria'}`);
  console.log(`URL da API: http://localhost:${PORT}/api`);
  console.log(`=================================\n`);
});

// Tratamento de erros do servidor
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\nERRO: A porta ${PORT} já está em uso.`);
    console.log('Tente encerrar o processo que está usando esta porta ou use uma porta diferente.');
    console.log('Você pode encerrar todos os processos Node.js com: taskkill /F /IM node.exe\n');
  } else {
    console.error('Erro ao iniciar o servidor:', error);
  }
  process.exit(1);
});

// Encerrar corretamente ao receber sinal de término
process.on('SIGINT', () => {
  console.log('\nEncerrando o servidor...');
  server.close(() => {
    console.log('Servidor encerrado com sucesso.\n');
    process.exit(0);
  });
});
