# 📅 Rotina Diária

[![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](https://github.com/seu-usuario/rotina-diaria)
[![Licença](https://img.shields.io/badge/licença-MIT-blue)](LICENSE)

Aplicação web interativa desenvolvida para ajudar crianças a organizarem suas rotinas diárias de forma lúdica e educativa. Projetada especialmente para a Clarinha, esta ferramenta transforma tarefas cotidianas em uma experiência divertida e engajadora.

## 🎯 Objetivo

Facilitar a organização da rotina infantil através de uma interface colorida e interativa, onde as crianças podem visualizar suas atividades diárias e marcar as tarefas concluídas.

## ✨ Funcionalidades

- 📝 Criação de rotinas personalizadas por horário
- 🎨 Gerenciamento de atividades (adicionar, editar, remover)
- ✅ Marcação de tarefas como concluídas
- ☁️ Persistência de dados no Supabase
- 📱 Interface responsiva e amigável para crianças
- 🎵 Atividades com ícones visuais intuitivos

## 🚀 Começando

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conta no [Supabase](https://supabase.com/)
- Node.js: https://nodejs.org/pt (opcional, para servidor local)
- Baixe o VS Code: https://code.visualstudio.com/download (editor opcional)
- Baixe o git: https://git-scm.com/downloads

### Características técnicas do projeto

- Arquitetura cliente-servidor
- Frontend baseado em React com Vite
- Backend em NestJS

### Configuração do Banco de Dados (Supabase)

Execute os seguintes scripts SQL no Supabase para criar as tabelas necessárias:

### 1. Tabela de Atividades
```sql
-- Tabela para armazenar as atividades disponíveis
CREATE TABLE activities (
    name VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir algumas atividades padrão
INSERT INTO activities (name, icon) VALUES
    ('Acordar', 'fa-sun'),
    ('Almoçar', 'fa-utensils'),
    ('Aula de Música', 'fa-music'),
    ('Brincar', 'fa-puzzle-piece'),
    ('Dentista', 'fa-tooth'),
    ('Dever de Casa', 'fa-book-open'),
    ('Dormir', 'fa-moon'),
    ('Escola', 'fa-school');
```

### 2. Tabela de Rotinas
```sql
-- Tabela para armazenar as rotinas criadas
CREATE TABLE routines (
    id INTEGER PRIMARY KEY,
    routine_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhorar performance na busca por routine_data
CREATE INDEX idx_routines_routine_data ON routines USING GIN (routine_data);
```

### 3. Políticas de Segurança (RLS)
```sql
-- Habilitar Row Level Security
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

-- Permitir acesso público para leitura e escrita (para demonstração)
-- Em produção, configure políticas mais restritivas
CREATE POLICY "Permitir acesso público às atividades" ON activities
    FOR ALL USING (true);

CREATE POLICY "Permitir acesso público às rotinas" ON routines
    FOR ALL USING (true);
```

## 🏗️ Estrutura do Projeto

```
rotina-diaria/
├── index.html          # Página principal da aplicação
├── script.js           # Lógica JavaScript principal
├── styles.css          # Estilos da aplicação
├── supabaseClient.js   # Configuração do cliente Supabase
├── testSupabase.js     # Teste de conexão com Supabase
├── frontend/           # Pasta principal do frontend desenvolvido com REACT
├   └──                 
├── backend/            # Pasta principal do backend desenvolvido com NestJS
├   └──                 
└── README.md           # Documentação do projeto
```

## 🛠️ Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/rotina-diaria.git
   cd rotina-diaria
   ```

2. **Instale as dependências**
   - Abra um novo terminal e navegue até a pasta /frontend conforme o comando de exemplo:
   ```
   cd .\frontend\
   ```

   - Instale todas as dependências do React JS com o comando:
   ```
   npm i
   ```

   - retorne na pasta raiz do projeto e navegue até a pasta /backend:
   ```
   cd .. .\backend\
   ```

   - Instale todas as dependências do NestJS com o comando:
   ```
   npm i
   ```

3. **Configure o Supabase**
   - Crie um novo projeto em [Supabase](https://supabase.com/)
   - Execute os scripts SQL fornecidos na seção de configuração do banco de dados
   - Copie as credenciais do projeto (URL e chave pública) para o arquivo `supabaseClient.js`

4. **Execute localmente**
   - Pelo terminal navegue até a pasta backend
   - Inicialize o servidor da api local:
      ```
      npm run start:dev
      ```
   - A api deve estar rodando e a mensagem de sucesso é exibida no navegador ao acessar http://localhost:3000/
   - Abra um novo terminal
   - Navegue até a pasta frontend
   - Inicialize o servidor frontend local:
      ```
      npm run dev
      ```

   - Método 1: Abra o arquivo `index.html` diretamente no navegador
   - Método 2: Use um servidor local:
     ```bash
     npx http-server
     ```
     E acesse: http://localhost:8080

## 📱 Como Usar

1. **Adicionar Atividades**
   - Clique no botão "+" para adicionar uma nova atividade
   - Preencha o nome e selecione um ícone
   - Defina o horário da atividade

2. **Gerenciar Rotina**
   - Arraste e solte as atividades para reorganizá-las
   - Clique no ícone de lixeira para remover uma atividade
   - Marque as atividades como concluídas clicando nelas

3. **Personalização**
   - Adicione suas próprias atividades personalizadas
   - Ajuste os horários conforme necessário
   - A interface se adapta automaticamente ao tamanho da tela

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Adicione suas mudanças (`git add .`)
4. Comite suas mudanças (`git commit -m 'Add some AmazingFeature'`)
5. Faça o Push da Branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- Ícones por [Font Awesome](https://fontawesome.com/)
- Hospedagem por [Supabase](https://supabase.com/)
- Inspiração: Clarinha e todas as crianças que merecem uma rotina mais divertida!
- Criação: Piterson Murilo Boscolo