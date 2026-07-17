# 💰 Personal Finance Tracker

A full-stack personal finance management application built with **React.js** and **Spring Boot**. Track income, expenses, budgets, and generate financial reports — all secured with JWT authentication.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router, Recharts, Axios, React Icons |
| **Backend** | Spring Boot 3.4, Spring Security, Spring Data JPA |
| **Database** | H2 (In-Memory) |
| **Authentication** | JWT (JSON Web Tokens) with BCrypt password hashing |
| **Export** | OpenCSV (CSV), OpenPDF (PDF) |
| **Build Tools** | Maven (backend), npm (frontend) |

---

## ✨ Features

### 🔐 Authentication
- User signup and login with JWT token management
- BCrypt password hashing
- Protected routes — users can only view their own financial data
- Auto-token attachment via Axios interceptors

### 📊 Dashboard
- Real-time financial overview with animated stat cards
- **Expense Breakdown** — Donut chart by category
- **Income vs. Expense Trend** — 6-month line chart
- **Income Sources** — Horizontal bar chart
- **Recent Transactions** — Quick list of last 5

### 💳 Transaction Management
- Add, edit, and delete daily incomes/expenses
- Categorize transactions (14 default categories)
- Filter by date range, type (income/expense), and category
- Summary bar with running totals

### 📈 Budget Analytics
- Set monthly spending limits per category
- Visual progress bars (green → yellow → red)
- Over-budget alerts with pulsing warnings
- Month picker to view different periods

### 📄 Data Export
- **CSV Report** — Spreadsheet-compatible for Excel/Google Sheets
- **PDF Report** — Professionally formatted with color-coded table and summary
- Quick date range presets (This Month, Last Month, Last 3 Months, This Year)

---

## 📁 Project Structure

```
Personal Finance Tracker/
│
├── backend/                              # Spring Boot Application
│   ├── pom.xml                           # Maven dependencies
│   └── src/main/
│       ├── java/practice/dc/financetracker/
│       │   ├── FinanceTrackerApplication.java
│       │   ├── controller/               # REST API endpoints
│       │   │   ├── AuthController.java
│       │   │   ├── TransactionController.java
│       │   │   ├── CategoryController.java
│       │   │   ├── BudgetController.java
│       │   │   ├── DashboardController.java
│       │   │   └── ExportController.java
│       │   ├── service/                  # Business logic
│       │   │   ├── AuthService.java
│       │   │   ├── TransactionService.java
│       │   │   ├── CategoryService.java
│       │   │   ├── BudgetService.java
│       │   │   ├── DashboardService.java
│       │   │   └── ExportService.java
│       │   ├── entity/                   # JPA Entities
│       │   │   ├── User.java
│       │   │   ├── Transaction.java
│       │   │   ├── Category.java
│       │   │   └── Budget.java
│       │   ├── repository/               # Spring Data Repositories
│       │   ├── dto/                      # Request/Response DTOs
│       │   └── security/                 # JWT & Spring Security
│       │       ├── SecurityConfig.java
│       │       ├── JwtTokenProvider.java
│       │       ├── JwtAuthenticationFilter.java
│       │       └── CustomUserDetailsService.java
│       └── resources/
│           ├── application.properties
│           └── data.sql                  # Seed data
│
└── frontend/                             # React Application
    └── src/
        ├── index.js / index.css          # Entry point & design system
        ├── App.js                        # Routing & layout
        ├── services/                     # API services
        │   ├── api.js                    # Axios instance + JWT interceptor
        │   ├── authService.js
        │   ├── transactionService.js
        │   ├── budgetService.js
        │   ├── dashboardService.js
        │   └── exportService.js
        ├── components/                   # Reusable components
        │   ├── Sidebar.js
        │   ├── ProtectedRoute.js
        │   ├── StatCard.js
        │   ├── ChartCard.js
        │   ├── BudgetCard.js
        │   ├── TransactionForm.js
        │   ├── TransactionTable.js
        │   └── Loader.js
        └── pages/                        # Application pages
            ├── Login.js
            ├── Signup.js
            ├── Dashboard.js
            ├── Transactions.js
            ├── Budgets.js
            └── Reports.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 17+** — [Download](https://adoptium.net/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Maven** (included via wrapper)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Personal Finance Tracker"
```

### 2. Start the Backend

```bash
cd backend
./mvnw.cmd spring-boot:run       # Windows
./mvnw spring-boot:run            # macOS / Linux
```

The backend starts at **http://localhost:8080**

### 3. Start the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend starts at **http://localhost:3000**

### 4. Open the App

Navigate to **http://localhost:3000** in your browser.

#### Demo Credentials

| Username | Password |
|----------|----------|
| `demo` | `demo123` |

---

## 🔌 API Endpoints

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |

### Transactions (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions` | List all transactions (supports `?startDate=&endDate=&type=&category=`) |
| `POST` | `/api/transactions` | Create a new transaction |
| `PUT` | `/api/transactions/{id}` | Update a transaction |
| `DELETE` | `/api/transactions/{id}` | Delete a transaction |

### Budgets (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/budgets?month=YYYY-MM` | List budgets for a month |
| `POST` | `/api/budgets` | Create a new budget |
| `PUT` | `/api/budgets/{id}` | Update a budget |
| `DELETE` | `/api/budgets/{id}` | Delete a budget |

### Other (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard` | Dashboard analytics data |
| `GET` | `/api/categories` | List all categories |
| `POST` | `/api/categories` | Create a custom category |
| `GET` | `/api/export/csv?startDate=&endDate=` | Download CSV report |
| `GET` | `/api/export/pdf?startDate=&endDate=` | Download PDF report |

---

## 🗄️ Database

This project uses **H2 in-memory database** for zero-setup development.

- **H2 Console:** http://localhost:8080/h2-console
- **JDBC URL:** `jdbc:h2:mem:financedb`
- **Username:** `sa`
- **Password:** *(empty)*

> ⚠️ Data resets on every server restart. Seed data from `data.sql` is auto-loaded on startup.

### Default Categories

| Expense | Income |
|---------|--------|
| Food & Dining | Salary |
| Transportation | Freelance |
| Housing | Investments |
| Utilities | Other Income |
| Entertainment | |
| Shopping | |
| Healthcare | |
| Education | |
| Travel | |
| Subscriptions | |

---

## 🎨 Design

- **Theme:** Dark mode with deep navy backgrounds (`#0a0a1a`, `#0f0f23`)
- **Accents:** Cyan-to-purple gradient (`#00d2ff` → `#7a5cfa`)
- **Cards:** Glassmorphism with `backdrop-filter: blur()`
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts
- **Animations:** Fade-in, slide-up, staggered rows, pulsing alerts
- **Charts:** Custom-themed Recharts with gradient fills
- **Responsive:** CSS Grid layouts adapt from desktop to mobile

---

## 🧪 Testing

### Backend

```bash
cd backend
./mvnw.cmd test
```

### Frontend

```bash
cd frontend
npm test
```

---

## 📝 License

This project is for educational and portfolio purposes.
