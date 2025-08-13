# Rotina Diária

Aplicação web para organizar a rotina diária da Clarinha de forma divertida e interativa.

## Configuração do Banco de Dados (Supabase)

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

## Estrutura do Projeto

- `index.html` - Página principal da aplicação
- `script.js` - Lógica JavaScript principal
- `styles.css` - Estilos da aplicação
- `supabaseClient.js` - Configuração do cliente Supabase
- `testSupabase.js` - Teste de conexão com Supabase
- `teste.html` - Página de teste da conexão

## Como usar

1. Configure o Supabase com os scripts SQL acima
2. Atualize as credenciais em `supabaseClient.js`
3. Execute um servidor local (ex: `npx http-server`)
4. Acesse a aplicação no navegador

## Funcionalidades

- ✅ Criar rotinas personalizadas por horário
- ✅ Gerenciar atividades (adicionar, editar, remover)
- ✅ Marcar tarefas como concluídas
- ✅ Persistência de dados no Supabase
- ✅ Interface responsiva e amigável para crianças