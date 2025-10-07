
# W&B Capital Monorepo (POC)
Includes:
- **wb-api**: NestJS + Prisma + PostgreSQL REST API (Deals, Finance/DSCR, Glossary, Auth) + Puppeteer crawler
- **wb-web**: Minimal web client to list deals and view metrics

## Quick Start (Local, with Docker)

### 1) Start DB + API
```bash
cd wb-api
docker compose up -d
# In a new terminal:
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run start:dev
# API: http://localhost:3000/api/v1
```

### 2) Test in Postman
Import the Postman collection: `wb-api/postman/wb-api.postman_collection.json`

Try:
- `POST /api/v1/deals` (create a deal)
- `POST /api/v1/deals/:id/finance` (compute DSCR etc.)
- `GET  /api/v1/deals` (list deals)
- `GET  /api/v1/deals/:id/metrics`
- `GET  /api/v1/glossary/dscr`

### 3) (Optional) Run Puppeteer crawler and push to API
```bash
cd wb-api
npm run crawl:loopnet
```
This scrapes a sample LoopNet page (Raleigh NC) and posts results to your API.

### 4) Run the Web Client
```bash
cd ../wb-web
npm install
npm run dev
# Open http://localhost:5173 and set API base if needed
```

---

## Folder Structure
```
wb-capital/
├── wb-api/      # REST API + crawler
└── wb-web/      # simple web UI (Vite + TS)
```
