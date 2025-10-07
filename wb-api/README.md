
# W&B API (NestJS + Prisma)

## Run
```bash
docker compose up -d          # start Postgres (and API if desired)
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run start:dev             # http://localhost:3000/api/v1
```

## Crawling
```bash
npm run crawl:loopnet         # scrapes sample LoopNet (Raleigh) and posts to /deals
```

## Endpoints
- POST /api/v1/deals
- GET  /api/v1/deals
- GET  /api/v1/deals/:id
- POST /api/v1/deals/:id/finance
- GET  /api/v1/deals/:id/metrics
- GET  /api/v1/glossary/dscr
- POST /api/v1/auth/register, /login
