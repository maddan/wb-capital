# 🏢 W&B Capital – Real Estate Syndication Platform

### About the Project
W&B Capital is an AI-driven real estate syndication platform that helps investors discover, analyze, and participate in the **best multifamily, CRE, RV park, and housing deals** across the United States.

This project allows users to **find the best real estate deals in any given city** using data ingested from CSV files (MVP 1) or, later, **live data crawlers** and **AI-enhanced property scoring**.  

Built on:
- **NestJS + Prisma (Backend API)**  
- **PostgreSQL (Database)**  
- **Angular (Frontend Web App)**  
- **AI/ML Modules (Phase 2)** for intelligent deal scoring, trust metrics, and text-to-speech search experience.

---

## 🧠 Vision

> To empower investors to make smarter, faster, and more confident decisions using trusted data, transparent analytics, and a personalized “gut-check” trust layer powered by AI.

W&B Capital aims to blend **Blackstone-level analytics** and **Sam Zell-style intuition** — offering both institutional precision and human trust.

---

## 🚀 MVP 1 (Proof of Concept)

### Core Goals
1. **City-based Search**
   - Ingest deals from CSV for a single city (Austin, TX for example).
   - Display on web dashboard with filters (city, state, price, cap rate, NOI).

2. **Deal Analysis**
   - Calculate DSCR, cap rate, cash flow, and finance metrics directly from the app.

3. **Bulk Ingestion**
   - Upload CSVs using the frontend or command line to seed sample data.

4. **API Connectivity**
   - REST-based backend (NestJS + Prisma) serving the Angular frontend.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | Angular 17 + TypeScript | Investor dashboard and CSV ingestion UI |
| **Backend** | NestJS (REST API) | Business logic, endpoints, and AI connectors |
| **Database** | PostgreSQL + Prisma ORM | Persistent data storage |
| **Crawler (Future)** | Puppeteer / Playwright | Scrape live listings from CREXi, LoopNet |
| **AI Layer (Future)** | OpenAI / Claude + Vector DB | Smart ranking, voice & chat interaction |

---

## 🧩 Folder Structure

