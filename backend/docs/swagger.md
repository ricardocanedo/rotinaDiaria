# Documentação da API com Swagger

## Visão Geral

Esta API utiliza o Swagger/OpenAPI para documentação interativa. O Swagger permite que desenvolvedores visualizem e testem os endpoints da API diretamente através de uma interface web.

## Acesso à Documentação

Após iniciar o servidor, a documentação estará disponível em:

```
http://localhost:3000/api/docs
```

## Estrutura da Documentação

A documentação é organizada por tags que agrupam endpoints relacionados:

- **users**: Endpoints para gerenciamento de usuários

## Endpoints Disponíveis

### Usuários

1. `POST /users` - Criar um novo usuário
2. `GET /users` - Listar todos os usuários
3. `GET /users/{id}` - Obter um usuário específico
4. `PATCH /users/{id}` - Atualizar um usuário
5. `DELETE /users/{id}` - Excluir um usuário

## Testando a API

A interface do Swagger permite testar todos os endpoints diretamente:

1. Acesse `http://localhost:3000/api/docs`
2. Clique em um endpoint para expandir os detalhes
3. Clique em "Try it out"
4. Preencha os parâmetros necessários
5. Clique em "Execute" para enviar a requisição

## Configuração

A configuração do Swagger está localizada em:
- [src/swagger/swagger.config.ts](file:///c:/Users/Murilo/Desktop/rotinaDiaria-main/backend/src/swagger/swagger.config.ts) - Configurações básicas da documentação
- [src/swagger/swagger.service.ts](file:///c:/Users/Murilo/Desktop/rotinaDiaria-main/backend/src/swagger/swagger.service.ts) - Serviço responsável pela inicialização
- [src/main.ts](file:///c:/Users/Murilo/Desktop/rotinaDiaria-main/backend/src/main.ts) - Inicialização do Swagger na aplicação

## Personalização

Para personalizar a documentação:

1. Modifique as configurações em [src/swagger/swagger.config.ts](file:///c:/Users/Murilo/Desktop/rotinaDiaria-main/backend/src/swagger/swagger.config.ts)
2. Adicione mais tags e descrições conforme necessário
3. Reinicie o servidor para ver as alterações