# 🔍 How It Works — Personal Finance Tracker

A comprehensive guide to understanding the architecture, data flow, and inner workings of the FinTrack Personal Finance Tracker application.

---

## 📐 Architecture Overview

The application follows a **client-server architecture** with a clear separation of concerns:

```
┌────────────────────────┐         HTTP/REST           ┌──────────────────────────┐
│                        │   ◄──────────────────────►  │                          │
│   React Frontend       │      JSON + JWT Token       │   Spring Boot Backend    │
│   (Port 3000)          │                              │   (Port 8080)            │
│                        │                              │                          │
│  ┌──────────────────┐  │                              │  ┌────────────────────┐  │
│  │  Pages           │  │                              │  │  Controllers       │  │
│  │  (Dashboard,     │  │                              │  │  (REST Endpoints)  │  │
│  │   Transactions,  │  │                              │  │                    │  │
│  │   Budgets,       │  │                              │  └────────┬───────────┘  │
│  │   Reports)       │  │                              │           │              │
│  └────────┬─────────┘  │                              │  ┌────────▼───────────┐  │
│           │             │                              │  │  Services          │  │
│  ┌────────▼─────────┐  │                              │  │  (Business Logic)  │  │
│  │  Services        │  │                              │  │                    │  │
│  │  (API Calls)     │  │                              │  └────────┬───────────┘  │
│  │  + Axios         │  │                              │           │              │
│  └──────────────────┘  │                              │  ┌────────▼───────────┐  │
│                        │                              │  │  Repositories      │  │
└────────────────────────┘                              │  │  (Data Access)     │  │
                                                        │  └────────┬───────────┘  │
                                                        │           │              │
                                                        │  ┌────────▼───────────┐  │
                                                        │  │  H2 Database       │  │
                                                        │  │  (In-Memory)       │  │
                                                        │  └────────────────────┘  │
                                                        └──────────────────────────┘
```

---

## 🔐 Authentication Flow

The app uses **JWT (JSON Web Token)** based authentication. Here's how the complete auth flow works:

### 1. User Signup

```
User fills signup form → POST /api/auth/signup
                           │
                           ▼
                    AuthController receives request
                           │
                           ▼
                    AuthService:
                      ├── Check if username/email already exists
                      ├── Hash password with BCrypt
                      ├── Save new User entity to database
                      ├── Generate JWT token using JwtTokenProvider
                      └── Return token + user info in response
                           │
                           ▼
                    Frontend stores token in localStorage
                    Redirects to /dashboard
```

### 2. User Login

```
User fills login form → POST /api/auth/login
                           │
                           ▼
                    AuthController receives request
                           │
                           ▼
                    AuthService:
                      ├── Load user by username (CustomUserDetailsService)
                      ├── Verify password hash with BCrypt
                      ├── Generate JWT token (valid for 24 hours)
                      └── Return token + user info
                           │
                           ▼
                    Frontend stores token & user JSON in localStorage
                    Redirects to /dashboard
```

### 3. Authenticated API Requests

```
Frontend makes API call (e.g., GET /api/transactions)
         │
         ▼
  Axios Interceptor automatically adds:
  "Authorization: Bearer <jwt_token>" header
         │
         ▼
  Request hits Spring Security Filter Chain:
    ├── JwtAuthenticationFilter:
    │     ├── Extract token from Authorization header
    │     ├── Validate token (signature, expiry)
    │     ├── Extract username from token claims
    │     ├── Load UserDetails from database
    │     └── Set authentication in SecurityContext
    │
    └── SecurityConfig:
          ├── Public endpoints: /api/auth/**, /h2-console/**
          └── All other endpoints require authentication
         │
         ▼
  Controller processes the request
  (gets current user from SecurityContext)
```

### 4. Token Expiry / 401 Handling

```
If server returns 401 (Unauthorized):
         │
         ▼
  Axios Response Interceptor:
    ├── Clears localStorage (token + user)
    └── Redirects to /login page
```

---

## 📊 Dashboard Data Flow

When a user navigates to the Dashboard, here's the complete data pipeline:

```
Dashboard.js mounts (useEffect)
         │
         ▼
  dashboardService.getDashboard()
         │
         ▼
  GET /api/dashboard (with JWT token)
         │
         ▼
  DashboardController → DashboardService:
    │
    ├── Get current authenticated user from SecurityContext
    │
    ├── Calculate totalIncome:
    │     └── SUM(amount) WHERE user_id = ? AND type = 'INCOME'
    │         AND date is within current month
    │
    ├── Calculate totalExpenses:
    │     └── SUM(amount) WHERE user_id = ? AND type = 'EXPENSE'
    │         AND date is within current month
    │
    ├── Calculate balance:
    │     └── totalIncome - totalExpenses
    │
    ├── Build expenseByCategory:
    │     └── GROUP BY category WHERE type = 'EXPENSE'
    │         Returns [{name: "Food", value: 250.00}, ...]
    │
    ├── Build incomeByCategory:
    │     └── GROUP BY category WHERE type = 'INCOME'
    │         Returns [{name: "Salary", value: 5000.00}, ...]
    │
    ├── Build monthlyTrend (last 6 months):
    │     └── For each month, SUM income and expense
    │         Returns [{month: "Jan", income: 5000, expense: 3200}, ...]
    │
    └── Get recentTransactions:
          └── TOP 5 transactions ORDER BY date DESC
         │
         ▼
  Response JSON sent back to frontend
         │
         ▼
  Dashboard.js:
    ├── Sets state with received data
    ├── Renders 3 StatCards (Income, Expenses, Balance)
    ├── Renders PieChart (Expense Breakdown by category)
    ├── Renders LineChart (6-month Income vs. Expense trend)
    ├── Renders BarChart (Income Sources by category)
    └── Renders Recent Transactions list
```

---

## 💳 Transaction CRUD Flow

### Creating a Transaction

```
User clicks "Add Transaction" → TransactionForm opens as modal
         │
         ▼
  User fills: Type, Amount, Date, Category, Description
  User clicks "Add Transaction" button
         │
         ▼
  TransactionForm.handleSubmit()
    ├── Validates required fields
    └── Calls parent onSubmit(formData)
         │
         ▼
  Transactions.handleSubmit(formData)
    └── transactionService.create(formData)
         │
         ▼
  POST /api/transactions
  Body: { type: "EXPENSE", amount: 45.00, date: "2025-07-13",
          category: "Food & Dining", description: "Lunch" }
         │
         ▼
  TransactionController → TransactionService:
    ├── Get current user from SecurityContext
    ├── Find Category entity by name
    ├── Create Transaction entity:
    │     ├── Set user, type, amount, date, category, description
    │     └── Save to database via TransactionRepository
    └── Return saved transaction as JSON
         │
         ▼
  Frontend closes modal, reloads transaction list
```

### Editing a Transaction

```
User clicks Edit (pencil icon) on a table row
         │
         ▼
  Transactions.handleEdit(txn):
    ├── Sets editData state with selected transaction
    └── Opens TransactionForm pre-filled with existing data
         │
         ▼
  User modifies fields and submits
         │
         ▼
  PUT /api/transactions/{id}
         │
         ▼
  TransactionService:
    ├── Find transaction by ID
    ├── Verify it belongs to current user (security check)
    ├── Update fields
    └── Save to database
```

### Deleting a Transaction

```
User clicks Delete (trash icon) → Browser confirm dialog
         │
         ▼
  If confirmed → DELETE /api/transactions/{id}
         │
         ▼
  TransactionService:
    ├── Find transaction by ID
    ├── Verify ownership (belongs to current user)
    └── Delete from database
```

### Filtering Transactions

```
User clicks "Filters" button → Filter panel expands
         │
         ▼
  User sets: Start Date, End Date, Type (Income/Expense)
  Filters auto-apply via useCallback + useEffect
         │
         ▼
  GET /api/transactions?startDate=2025-01-01&endDate=2025-07-13&type=EXPENSE
         │
         ▼
  TransactionService:
    ├── Build dynamic JPA query based on params
    ├── Filter by user + date range + type + category
    └── Return filtered list sorted by date DESC
```

---

## 📈 Budget System Flow

### How Budget Tracking Works

```
User creates a budget:
  { categoryName: "Food & Dining", monthlyLimit: 500.00, month: "2025-07" }
         │
         ▼
  POST /api/budgets
         │
         ▼
  BudgetService:
    ├── Create Budget entity linked to user and category
    ├── Set monthlyLimit and month
    └── Save to database
```

### Budget vs. Actual Calculation (on page load)

```
GET /api/budgets?month=2025-07
         │
         ▼
  BudgetService.getByMonth():
    │
    For each budget:
    ├── Query: SUM(amount) FROM transactions
    │   WHERE category = budget.category
    │   AND type = 'EXPENSE'
    │   AND date is within budget.month
    │   AND user_id = current_user
    │
    ├── Calculate:
    │     spent = SUM result (actual spending)
    │     remaining = monthlyLimit - spent
    │     percentUsed = (spent / monthlyLimit) × 100
    │     overBudget = spent > monthlyLimit
    │
    └── Return enriched budget object with all calculated fields
         │
         ▼
  Frontend renders BudgetCards:
    ├── Progress bar width = percentUsed (capped at 100%)
    ├── Color coding:
    │     ├── Green  (normal):  percentUsed ≤ 80%
    │     ├── Yellow (warning): percentUsed > 80%
    │     └── Red    (over):    percentUsed > 100%
    └── Pulsing alert if overBudget = true
```

---

## 📄 Report Export Flow

### CSV Export

```
User selects date range → clicks "Download CSV"
         │
         ▼
  GET /api/export/csv?startDate=2025-01-01&endDate=2025-07-13
  (responseType: 'blob')
         │
         ▼
  ExportService:
    ├── Query transactions for user within date range
    ├── Use OpenCSV library to write data:
    │     Headers: Date, Type, Category, Description, Amount
    │     One row per transaction
    └── Return as downloadable CSV stream
         │
         ▼
  Frontend exportService:
    ├── Receives response as Blob
    ├── Creates temporary URL with URL.createObjectURL()
    ├── Dynamically creates <a> element with download attribute
    ├── Triggers click to start download
    └── Cleans up: removes element, revokes object URL
```

### PDF Export

```
User selects date range → clicks "Download PDF"
         │
         ▼
  GET /api/export/pdf?startDate=2025-01-01&endDate=2025-07-13
         │
         ▼
  ExportService:
    ├── Query transactions for user within date range
    ├── Use OpenPDF library to generate PDF:
    │     ├── Title: "Financial Report"
    │     ├── Date range subtitle
    │     ├── Summary: Total Income, Total Expenses, Balance
    │     ├── Transaction table with color-coded rows:
    │     │     ├── Green background for Income rows
    │     │     └── Red background for Expense rows
    │     └── Footer with generation timestamp
    └── Return as downloadable PDF stream
         │
         ▼
  Frontend handles download same as CSV (Blob → <a> click)
```

---

## 🗄️ Database Schema & Configuration

The database schema maps users, categories, transactions, and budgets:

```sql
┌──────────────────┐     ┌──────────────────┐
│      users       │     │    categories     │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ username (unique)│     │ name             │
│ email (unique)   │     │ type (INCOME/    │
│ password (hash)  │     │       EXPENSE)   │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │    ┌───────────────────┘
         │    │
┌────────▼────▼────┐     ┌──────────────────┐
│  transactions    │     │     budgets       │
├──────────────────┤     ├──────────────────┤
│ id (PK)          │     │ id (PK)          │
│ amount           │     │ monthly_limit    │
│ type             │     │ month            │
│ description      │     │ user_id (FK)     │
│ date             │     │ category_id (FK) │
│ user_id (FK)     │     └──────────────────┘
│ category_id (FK) │
└──────────────────┘
```

### 1. Local Development (H2 In-Memory)
- **Properties**: Managed via `application.properties`.
- **Seed Data**: `data.sql` runs on startup using H2-specific syntax (e.g. `DATEADD`, `FORMATDATETIME`).
- **Persistence**: Temporary. Data resets on server restart.

### 2. Production (PostgreSQL on Neon)
- **Properties**: Activated via the `prod` profile (`application-prod.properties`).
- **Seed Data**: `data-prod.sql` runs using standard SQL and PostgreSQL syntax (e.g. `INTERVAL`, `TO_CHAR`).
- **Safety**: Uses `spring.sql.init.continue-on-error=true` to safely run the seed queries without crashing when records already exist.
- **Persistence**: Fully persistent cloud database.

---

## 🔄 Frontend Routing & Navigation

```
React Router v7 handles all routing:

/login          → Login page (public)
/signup         → Signup page (public)
/dashboard      → Dashboard with charts (protected)
/transactions   → Transaction CRUD table (protected)
/budgets        → Budget analytics (protected)
/reports        → CSV/PDF export (protected)
/               → Redirects to /dashboard
/*              → Redirects to /dashboard (404 catch-all)
```

**Protected Route Logic:**
```
ProtectedRoute component:
  ├── Check: localStorage has 'token'?
  │     ├── YES → Render child component
  │     └── NO  → Redirect to /login
```

**App Layout:**
```
For auth pages (/login, /signup):
  └── Full-screen centered card (no sidebar)

For protected pages:
  ├── Fixed sidebar on the left (260px)
  └── Main content area (flex: 1, with padding)
```

---

## 🔧 Security Configuration

The Spring Security setup (SecurityConfig.java) does the following:

```
SecurityFilterChain:
  ├── Disable CSRF (stateless REST API)
  ├── Enable CORS (allow frontend on port 3000)
  ├── Set session management to STATELESS
  ├── Configure URL authorization:
  │     ├── Permit all: /api/auth/**
  │     ├── Permit all: /h2-console/**
  │     └── Require authentication: everything else
  ├── Add JwtAuthenticationFilter before UsernamePasswordFilter
  └── Configure BCrypt password encoder
```

---

## 🛠️ Tech Stack Details

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend Framework** | React 19 | SPA with component-based UI |
| **Routing** | React Router v7 | Client-side navigation |
| **HTTP Client** | Axios | API calls + JWT interceptors |
| **Charts** | Recharts | Pie, Line, Bar chart visualizations |
| **Icons** | React Icons (FA) | UI icons throughout the app |
| **Backend Framework** | Spring Boot 3.4 | REST API + dependency injection |
| **Security** | Spring Security + JWT | Authentication & authorization |
| **ORM** | Spring Data JPA / Hibernate | Database abstraction |
| **Database** | H2 (in-memory) | Zero-config development database |
| **CSV Export** | OpenCSV | Transaction data to spreadsheet |
| **PDF Export** | OpenPDF | Formatted report generation |
| **Build (Backend)** | Maven | Dependency management & build |
| **Build (Frontend)** | Create React App | Webpack bundling & dev server |

---

## 🚀 How to Run

### Prerequisites
- **Java 17+** installed
- **Node.js 18+** installed

### Step 1: Start the Backend
```bash
cd backend
./mvnw.cmd spring-boot:run    # Windows
./mvnw spring-boot:run         # macOS / Linux
```
Backend starts at: `http://localhost:8080`

### Step 2: Start the Frontend
```bash
cd frontend
npm install       # First time only
npm start
```
Frontend starts at: `http://localhost:3000`

### Step 3: Login
Open `http://localhost:3000` in your browser.

**Demo credentials:** `demo` / `demo123`

---

## 📌 Key Design Decisions

1. **H2 In-Memory DB**: Chosen for zero-setup development. Swap to PostgreSQL/MySQL for production by changing `application.properties`.

2. **JWT over Sessions**: Stateless authentication scales better and works naturally with REST APIs and SPAs.

3. **Axios Interceptors**: Automatically attach JWT tokens to every request and handle 401 redirects globally — no manual token management in each service.

4. **Component-Based CSS**: Each component has its own CSS file instead of a single global stylesheet, making styles modular and maintainable.

5. **Glassmorphism Design**: Dark theme with glass-card effects, gradient accents, and micro-animations create a premium, modern feel.

6. **Seed Data**: `data.sql` pre-populates the database on every restart so the app always has demo data to showcase features.
