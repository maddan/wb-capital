
# 🏢 W&B Capital – AI-Driven Real Estate Syndication Platform

### About the Project
**W&B Capital** is an AI-driven real-estate syndication and deal-analysis platform that empowers investors to **find, evaluate, and close** the best multifamily, CRE, RV park, and housing investments across the U.S.

It combines **institution-grade analytics** with **AI-based intuition**, enabling both sophisticated and everyday investors to participate in high-quality real estate opportunities.

## 🎯 Project Overview
This project allows users to **find the best real-estate deals in any given city** using ingested or live property data.  
Built using:
- **NestJS + Prisma (Backend)**
- **Angular (Frontend)**
- **PostgreSQL (Database)**
- **AI modules (planned)** for intelligent deal scoring, investor matching, and natural-language deal search.

> **MVP 1** focuses on a **POC for one city**, ingesting static CSV data.  
> Later versions expand to nationwide live data from **CREXi**, **LoopNet**, and other sources with full AI automation.

## 🧠 Vision
> To give every investor the tools, data, and confidence of a Blackstone analyst — with the speed and simplicity of a mobile app.

W&B Capital blends **data precision** with **human intuition**, creating a transparent “trust layer” that helps investors not only *analyze* deals but also *act* on them — all within one unified platform.

## 🚀 MVP 1 (Proof of Concept)
### Core Features
1. **City-Based Search** – Import deals for one city (e.g., Austin, TX) via CSV; browse and filter in the dashboard.  
2. **Deal Analysis Calculator** – Robust finance calculator (DSCR, LTV, NOI, cap, debt service) with quick what‑if changes.  
3. **Bulk Data Ingestion** – Upload CSV through the Angular UI or CLI; populate deals into the DB.  
4. **REST API Connectivity** – NestJS + Prisma backend driving all endpoints.

## ⚙️ Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Angular 17 + TypeScript | Deal dashboard, calculator, ingestion UI |
| **Backend** | NestJS (REST API) | Business logic and AI integration |
| **Database** | PostgreSQL + Prisma ORM | Persistent storage |
| **Data Crawlers (Future)** | Playwright/Puppeteer | Live listings from CREXi/LoopNet |
| **AI Layer (Future)** | GPT/Claude + Vector Search | Voice/chat discovery, AI scoring |
| **Crowdfunding (Future)** | Stripe + SEC-Compliant APIs | Investor onboarding and funding execution |

## 💡 What Makes W&B Capital Different
| Feature | Description |
|--------|-------------|
| ⚙️ **Robust Deal Calculator** | Real-time debt service, DSCR, NOI, cap rate. Adjust assumptions on the fly. |
| 🤖 **Smart Investor Suggestions** | AI analyzes preferences and suggests the next best deal — built for investors on the go. |
| 🧱 **Crowdfunding Integration** | Planned: accredited investors participate directly; a hybrid **AI-driven real-estate crowdfunding marketplace**. |
| 🗣️ **Voice & Chat Search** | “Show me apartments under $5M in Austin with 7% cap rate.” |
| 🔒 **Trust Layer** | Explainable AI confidence scores based on comps, sponsor credibility, and sentiment. |
| 💼 **End-to-End Workflow** | Discovery → analysis → investor share → capital raise → close — in one place. |

## 🧩 Folder Structure
```
wb-capital/
├── wb-api/         # NestJS backend (patch files for ingest + CLI importer)
│   ├── src/ingest/
│   ├── data/
│   └── postman/
└── wb-web-angular/ # Angular frontend app
```

## ⚙️ Setup & Run (Local)
### 1) Backend (NestJS + Prisma)
- Ensure your existing API is set up and running (this package adds ingest endpoints & tools).  
- Add environment:
```
DATABASE_URL="postgresql://wb:password@localhost:5432/wb_core"
```
- Start:
```bash
cd wb-api
npm install
npx prisma generate
npm run start:dev
```
- Test:
```bash
curl http://localhost:3000/api/v1/deals
```

### 2) Frontend (Angular)
```bash
cd wb-web-angular
npm install
npm start
# open http://localhost:4200
```

## 🧾 Current Features
| Category | Description |
|----------|-------------|
| **Deals Dashboard** | View/filter deals by city/state/price/NOI |
| **Financial Calculator** | Compute DSCR, LTV, Cap Rate instantly |
| **CSV Bulk Ingest** | Upload datasets and seed the system |
| **Finance API** | `POST /deals/:id/finance` |
| **Investor Insights (Planned)** | Personalized AI tips and risk meter |
| **Crowdfunding (Planned)** | LP/GP dashboard, payouts, KYC |

## 🔮 Future Phases
| Phase | Focus | Description |
|------|-------|-------------|
| **MVP 1** | CSV-based city POC | Manual ingest for one market |
| **Phase 2** | Live Data + AI | CREXi/LoopNet + GPT ranking |
| **Phase 3** | Trust Layer + Voice | Explainable AI + voice UX |
| **Phase 4** | Crowdfunding | Direct LP investments inside platform |
| **Phase 5** | National Scale | Full 50-state coverage & alerts |

## 🤝 Contributing
1. Fork the repo  
2. Run locally  
3. PR with clear commit messages

## 📫 Contact
**W&B Capital** — “Where Data Meets Intuition”  
team@wbcapital.ai — www.wbcapital.ai (coming soon)
