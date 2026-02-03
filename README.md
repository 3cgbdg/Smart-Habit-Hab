# Smart Habit Lab

Minimalist app for tracking habits and running personal behavioral experiments.

## Stack
- **Frontend**: Next.js, MUI, Redux Toolkit,TanStack Query, React Hook Form + Zod.
- **Backend**: NestJS, PostgreSQL (TypeORM), JWT.

## Setup

### 1. Database
If you have Docker installed, just run:
```bash
docker-compose up -d
```

### 2. Backend
```bash
cd backend
npm install
npm run start:dev
```
*Don't forget to check `.env`.*

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## Structure
- `frontend/` - Next.js app with `app` router.
- `backend/` - NestJS project with TypeORM modules.
- `docker-compose.yml` - Simple setup for Postgres.
