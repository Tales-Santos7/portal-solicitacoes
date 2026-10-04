# Backend

## Configuração

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

API: `http://localhost:3333`

## Usuário de demonstração

- usuário: `admin`
- senha: `123456`

## Endpoints principais

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/requests`
- `POST /api/requests`
- `GET /api/requests/:id`
- `PATCH /api/requests/:id`
- `DELETE /api/requests/:id`
- `PATCH /api/requests/:id/status`
- `GET /api/requests/dashboard`
