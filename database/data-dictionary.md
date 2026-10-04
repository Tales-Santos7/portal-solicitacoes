# Dicionário de Dados

## users

| Campo         | Tipo         | Obrigatório | Descrição                |
| ------------- | ------------ | ----------: | ------------------------ |
| id            | integer      |         sim | Identificador do usuário |
| username      | varchar(100) |         sim | Nome de usuário único    |
| password_hash | varchar(255) |         sim | Senha armazenada em hash |
| created_at    | timestamp    |         sim | Data de criação          |

## requests

| Campo       | Tipo         | Obrigatório | Descrição             |
| ----------- | ------------ | ----------: | --------------------- |
| id          | integer      |         sim | Código da solicitação |
| title       | varchar(150) |         sim | Título                |
| description | text         |         sim | Descrição             |
| category    | varchar(30)  |         sim | Categoria             |
| status      | varchar(30)  |         sim | Status atual          |
| created_at  | timestamp    |         sim | Data de abertura      |
| updated_at  | timestamp    |         sim | Última atualização    |
| user_id     | integer      |         sim | Usuário solicitante   |
