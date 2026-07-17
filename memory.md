# 🧠 Memory — FinTrack Personal Finance Tracker

This file documents the development history, architecture decisions, fixes, and deployment details for the FinTrack application.

---

## 🚀 Deployed URLs & Credentials

| Service | Environment | URL |
|---------|-------------|-----|
| **Frontend** | Production (Vercel) | [https://fin-track-tcs-case-study.vercel.app](https://fin-track-tcs-case-study.vercel.app) |
| **Backend API** | Production (Render) | [https://fintrack-api-bl9v.onrender.com](https://fintrack-api-bl9v.onrender.com) |
| **Database** | Production (Neon PostgreSQL) | `postgresql://neondb_owner:***@ep-late-term-awh1samb-pooler.c-12.us-east-1.aws.neon.tech/neondb` |
| **Frontend** | Local Dev | `http://localhost:3000` |
| **Backend API** | Local Dev | `http://localhost:8080` |
| **H2 Console** | Local Dev (H2) | `http://localhost:8080/h2-console` |

### 🔑 Demo Credentials
* **Username**: `demo`
* **Password**: `demo123`

---

## 🛠️ Key Improvements & Fixes

### 1. Dashboard Net Balance Fix
* **Problem**: The Net Balance card was previously calculated in the frontend using `data.totalIncome - data.totalExpenses`. This did not match the backend's computed `data.balance` and could lead to precision discrepancies.
* **Fix**: Updated `Dashboard.js` to render `data.balance` directly from the backend's `DashboardResponse` DTO.

### 2. Mobile Responsive Layout
* **Sidebar Navigation**: Added a floating hamburger menu button (☰) and close button (✕) for devices under 768px. Implemented a blurred background overlay when open and configured the menu to auto-close upon route changes.
* **Grid Layouts**: Modified the stats card grid, charts grid, and transaction filters to collapse to single-column layouts on mobile screen widths.
* **Transaction Table**: Implemented progressive column hiding (`description` hides on tablets, `date` hides on small mobile screens) to fit smaller screen resolutions.
* **Buttons & Form Controls**: Increased tap target sizes and adjusted padding for touch screens.

### 3. Production PostgreSQL Database (Neon)
* **Dependency**: Added the PostgreSQL driver dependency (`org.postgresql:postgresql`) to `pom.xml`.
* **Profiles**: Split configuration into `application.properties` (uses H2 in-memory for local dev) and `application-prod.properties` (uses PostgreSQL for production).
* **Seed Data**: Created a PostgreSQL-compatible seed data file `data-prod.sql` using `INTERVAL` syntax for dates, `TO_CHAR` for date formatting, and `ON CONFLICT DO NOTHING` statements to prevent key constraint errors.

### 4. Deployable Backend Configuration
* **Docker Support**: Created a multi-stage `Dockerfile` and `.dockerignore` for compiling and containerizing the Spring Boot app on Render.
* **Dynamic Ports**: Configured `server.port=${PORT:8080}` to bind to the dynamic port allocated by Render.
* **CORS Settings**: Enhanced `SecurityConfig.java` to read `cors.allowed-origins` dynamically, defaulting to `http://localhost:3000` and including `https://fin-track-tcs-case-study.vercel.app`.

---

## 📂 Git & Project Setup
* Cleaned up nested `.git` submodules (removed `frontend/.git`).
* Created a root-level `.gitignore` file mapping all backend targets, node modules, build targets, OS files, and environment files.
* Pushed all code to GitHub repository: `https://github.com/DharmendraChakrawarti/FinTrack-TCS-CaseStudy.git`.
