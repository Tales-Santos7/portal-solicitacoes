# Memorial Técnico de Desenvolvimento

## 1. Objetivo

O projeto implementa um Portal de Solicitações Internas, permitindo autenticação, cadastro, consulta, alteração de status e exclusão de solicitações abertas, além de filtros e indicadores de dashboard.

## 2. Tecnologias utilizadas

- Backend: Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT, Zod, bcryptjs.
- Frontend: React, TypeScript, Vite.
- Infraestrutura: Docker Compose.

## 3. Justificativa técnica

**TypeScript:** tipagem estática no backend e frontend, facilitando manutenção e reduzindo erros.

**Express:** API REST objetiva, com middleware para autenticação, tratamento de erros e organização por rotas.

**Prisma:** acesso ao banco tipado e migrations integradas ao modelo.

**PostgreSQL:** banco relacional SQL adequado ao relacionamento entre usuários e solicitações.

**JWT:** autenticação stateless da API.

**Zod:** validação centralizada das entradas da API.

**React:** interface componentizada para consumo da API.

**Docker Compose:** reprodução simplificada do ambiente local do banco.

## 4. Arquitetura

A solução é dividida em frontend, backend e banco de dados. O frontend comunica-se com o backend por HTTP/JSON. O backend concentra autenticação, validação, regras de negócio e persistência.

No backend, as responsabilidades são separadas entre rotas, controllers, middlewares, schemas e acesso ao Prisma.

## 5. Modelagem

`User` representa o usuário autenticado. `Request` representa uma solicitação interna. Um usuário pode possuir várias solicitações.

## 6. Regras de negócio

- Apenas usuários autenticados acessam as solicitações.
- Toda solicitação inicia com status `ABERTO`.
- Data de criação e usuário solicitante são definidos pelo backend.
- Solicitações abertas podem ser editadas ou excluídas pelo próprio solicitante.
- O status pode ser `ABERTO`, `EM_ATENDIMENTO` ou `CONCLUIDO`.
- O dashboard apresenta total e quantidades por status.

## 7. Segurança básica

- Senhas armazenadas com hash.
- Rotas protegidas por JWT.
- Validação dos dados recebidos.
- Segredo JWT em variável de ambiente.

## 8. Análise crítica

A versão inicial prioriza simplicidade e clareza para o contexto da avaliação. Em produção, podem ser adicionados perfis e permissões, refresh token, auditoria, paginação, observabilidade, testes mais abrangentes, CI/CD e infraestrutura gerenciada.

## 9. Limitações

O logout remove o JWT do cliente, sem revogação server-side. A interface inicial concentra parte da apresentação no componente principal; a evolução pode extrair componentes e páginas para arquivos próprios.

