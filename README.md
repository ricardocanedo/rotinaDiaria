# 📅 Rotina Diária

[![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com/seu-usuario/rotina-diaria)
[![Licença](https://img.shields.io/badge/licença-MIT-blue)](LICENSE)

Aplicação web para ajudar principalmente crianças a organizarem suas rotinas diárias de forma lúdica e educativa. Foi pensada para a Clarinha e transforma tarefas cotidianas em uma experiência divertida com feedback visual e “coins” por tarefas concluídas.

## 🎯 Objetivo

Facilitar a organização da rotina com uma interface simples, colorida e acessível, onde é possível definir horários, escolher atividades e acompanhar o progresso ao longo do dia.

## ✨ Funcionalidades

- 📝 Criação de rotina por intervalos
- 🎨 Catálogo de atividades com ícones (adicionar, editar, remover)
- ✅ Marcação de tarefas como concluídas com contagem de “coins”
- 📱 Layout responsivo e amigável

## 🧰 Tecnologias

- Ícones: `Font Awesome` 
- Banco de dados: `SQLite` 
- App React em `frontend/` com Vite
- Backend em `backend/` com NestJS (estrutura base)

## 🏗️ Estrutura do Projeto

```
rotinaDiaria/
├── index.html
├── script.js
├── styles.css
├── supabaseClient.js        # (legado) não utilizado com SQLite
├── check-activities.html
├── config.js                # (legado) não utilizado com SQLite
├── package.json
├── frontend/                # App React (opcional)
│   ├── package.json
│   ├── src/
│   └── vite.config.js
└── backend/                 # NestJS (opcional)
    ├── package.json
    ├── src/
    └── tsconfig.json
```

## 🚀 Como Executar

#### App React (frontend/)

1. Acesse a pasta do app React:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Acesse a URL indicada pelo Vite (geralmente http://localhost:5173).

> Observação: o app React é um experimento e pode não refletir todas as funcionalidades da versão estática.

#### Backend NestJS (backend/)

1. Acesse a pasta do backend:
   ```bash
   cd backend
   npm install
   ```

2. Inicialize as migrations do Prisma:
   ```bash
    npx prisma migrate dev --name init
   ```

3. Gerar o cliente Prisma baseado no schema:
   ```bash
   npx prisma generate
   ```

4. Criar/atualizar o banco de dados:
   ```bash
   npx prisma db push
   ```

5. Inicie o servidor NestJS:
   ```bash
    npm run start:dev
    ```
 - O servidor básico subirá em http://localhost:3000.

## 📱 Como Usar (versão estática)

- Abra a aba "Criar Rotina" para montar a agenda do dia a cada 30 minutos.
- Selecione atividades do catálogo. Você pode cadastrar novas, editar ou remover.
- Na aba "Visualizar Rotina", marque as tarefas concluídas e acompanhe seus “coins”.
- Sem backend: dados apenas no LocalStorage.
- Com backend: persistência no SQLite (coins, atividades e rotina).

## 🤝 Contribuição

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Commit: `git commit -m "feat: sua feature"`
4. Push: `git push origin feature/sua-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Inspiração: A todas as crianças que merecem uma rotina mais divertida!
- Criação: 
  
  - ALISSON THALES FABRO
  - CINTIA MARA VIEIRA FRANCO
  - CLAUDIO EDUARDO CESARIO DE OLIVEIRA
  - JAQUELINE MICAELE MARIA SILVA
  - LUIZ FERNANDO DA SILVA PINTO
  - PITERSON MURILO BOSCOLO
  - RICARDO HENRIQUE CANEDO
  - TAIS ALVES SILVA RIBEIRO
