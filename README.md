# Rotina Diária

Aplicação web para gerenciamento de rotinas diárias, permitindo criar diferentes rotinas e associar atividades a horários específicos.

## Funcionalidades

- Crie múltiplas rotinas personalizadas
- Adicione atividades em horários específicos (de 30 em 30 minutos)
- Visualize e edite suas rotinas facilmente
- Interface responsiva e intuitiva

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 8.0 ou superior)
- NPM ou Yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/rotina-diaria.git
   cd rotina-diaria/backend
   ```

2. Instale as dependências do backend:
   ```bash
   npm install
   ```

3. Configure o banco de dados:
   - Certifique-se de que o MySQL está em execução
   - Crie um banco de dados chamado `rotina_diaria`
   - Execute o script de inicialização:
     ```bash
     node init-db.js
     ```

4. Configure as variáveis de ambiente no arquivo `.env` (copie de `.env.example` se existir):
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   DB_NAME=rotina_diaria
   ```

5. Inicie o servidor backend:
   ```bash
   node server.js
   ```

6. Em outro terminal, acesse a pasta do frontend e abra o arquivo `index.html` no navegador:
   ```bash
   cd ..
   start index.html
   ```

## Uso

1. **Criar uma nova rotina**:
   - Clique em "Nova Rotina"
   - Digite um nome para a rotina
   - Clique em "Salvar"

2. **Adicionar atividades**:
   - Selecione uma rotina no menu suspenso
   - Digite uma atividade em um dos horários disponíveis
   - Clique no ícone de salvar (disquete) ao lado do horário

3. **Editar atividades**:
   - Altere o texto da atividade desejada
   - Clique no ícone de salvar para atualizar

## Estrutura do Projeto

- `/backend` - Código do servidor Node.js/Express
  - `server.js` - Ponto de entrada do servidor
  - `routes.js` - Definição das rotas da API
  - `db.js` - Configuração do banco de dados
  - `schema.sql` - Esquema do banco de dados
  - `init-db.js` - Script de inicialização do banco de dados
- `index.html` - Página principal da aplicação
- `styles.css` - Estilos da aplicação
- `script.js` - Lógica do frontend

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript puro (ES6+)
- **Backend**: Node.js, Express
- **Banco de Dados**: MySQL
- **Outras Ferramentas**: NPM, Git

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e enviar pull requests.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.