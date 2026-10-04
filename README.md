# Portal de Solicitações Internas

Projeto Full Stack para gerenciamento de solicitações internas.

## Stack

- **Backend:** Node.js, TypeScript, Express, Prisma, PostgreSQL, JWT, Zod
- **Frontend:** React, TypeScript, Vite
- **Infraestrutura:** Docker Compose

## Estrutura

```text
portal-solicitacoes/
├── backend/      # API REST e regras de negócio
├── frontend/     # Aplicação web
├── database/     # Scripts SQL e dicionário de dados
└── docs/         # Memorial Técnico
```

## Requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- [Node.js 20+]
- [Docker Desktop]
- Docker Compose

## Instalação

### 1. Clone ou extraia o projeto

Acesse a pasta raiz do projeto:

```bash
cd portal-solicitacoes
```

### 2. Configure o banco de dados

O PostgreSQL é executado através do Docker Compose.

Na raiz do projeto, execute:

```bash
docker compose up -d postgres
```

Para verificar se o container está em execução:

```bash
docker compose ps
```

### 3. Configure o Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do `.env.example`:

```bash
copy .env.example .env
```

> No Linux/macOS, utilize:
>
> ```bash
> cp .env.example .env
> ```

Confira as variáveis de ambiente antes de continuar.

### 4. Configure o banco com Prisma

Gere o Prisma Client:

```bash
npx prisma generate
```

Execute as migrations:

```bash
npx prisma migrate dev --name init
```

Execute o seed para criar os dados iniciais:

```bash
npx prisma db seed
```

### 5. Execute o Backend

Ainda dentro da pasta `backend`:

```bash
npm run dev
```

A API estará disponível na porta configurada no projeto.

### 6. Configure o Frontend

Abra outro terminal e volte para a raiz do projeto:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do `.env.example`:

```bash
copy .env.example .env
```

> No Linux/macOS:
>
> ```bash
> cp .env.example .env
> ```

Inicie o frontend:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local para acesso à aplicação.

## Fluxo de execução

Após iniciar os serviços:

```text
Frontend (React)
       │
       │ HTTP / JSON
       ▼
Backend (Node.js + Express)
       │
       │ Prisma
       ▼
PostgreSQL
```

## Funcionalidades

- Autenticação de usuários
- Login e logout
- Cadastro de solicitações
- Edição de solicitações abertas
- Exclusão de solicitações abertas
- Consulta de solicitações
- Filtros por período, categoria e status
- Pesquisa por título
- Alteração de status
- Visualização de detalhes
- Dashboard com indicadores
- Controle de acesso por autenticação

## Status das solicitações

As solicitações podem possuir os seguintes status:

- **Aberto**
- **Em Atendimento**
- **Concluído**

Toda nova solicitação é criada inicialmente com o status **Aberto**.

## Categorias

As solicitações podem ser classificadas nas seguintes categorias:

- TI
- RH
- Compras
- Financeiro
- Infraestrutura

## Credencial de demonstração

A credencial de demonstração é criada automaticamente pelo seed do backend.

Após executar:

```bash
npx prisma db seed
```

utilize as credenciais definidas no seed para acessar a aplicação.

## Documentação

O projeto possui um **Memorial Técnico de Desenvolvimento** contendo:

- Tecnologias utilizadas
- Justificativas técnicas
- Arquitetura da aplicação
- Modelagem de dados
- Regras de negócio
- Estratégias de autenticação e segurança
- Limitações da solução
- Possíveis melhorias futuras

O documento está disponível em sua raiz.

## Observações

Para executar o projeto localmente, é necessário manter o Docker Desktop em execução enquanto o PostgreSQL estiver sendo utilizado.

O backend e o frontend devem ser executados em terminais separados.

## Autor

**Tales Santos**

### Minhas redes sociais

<div> 
   <a href="https://instagram.com/tales.s7" target="_blank"><img src="https://img.shields.io/badge/-Instagram-%23E4405F?style=for-the-badge&logo=instagram&logoColor=white"></a>
   <a href="https://www.linkedin.com/in/tales-santos7" target="_blank"><img src="https://img.shields.io/badge/-LinkedIn-%230077B5?style=for-the-badge&logo=linkedin&logoColor=white"></a>
   <a href="mailto:tales.js07@gmail.com"><img src="https://img.shields.io/badge/-Gmail-%23333?style=for-the-badge&logo=gmail&logoColor=white"></a>
   <a href="https://otalessantos.vercel.app/" target="_blank"><img src="https://img.shields.io/badge/-Portf%C3%B3lio-Ffa500?style=for-the-badge&logo=portfolio&logoColor=white"></a>
   <a href="https://wa.link/r43rss" target="_blank"><img src="https://img.shields.io/badge/-WhatsApp-%2523E4405F?style=for-the-badge&logo=whatsapp&logoColor=white"></a>
</div>
