-- Default Categories (system-level, userId = NULL)
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Salary', 'INCOME', 'FaBriefcase', '#4CAF50', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Freelance', 'INCOME', 'FaLaptop', '#8BC34A', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Investments', 'INCOME', 'FaChartLine', '#00BCD4', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Other Income', 'INCOME', 'FaWallet', '#009688', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Food & Dining', 'EXPENSE', 'FaUtensils', '#FF5722', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Transportation', 'EXPENSE', 'FaCar', '#FF9800', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Housing', 'EXPENSE', 'FaHome', '#795548', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Utilities', 'EXPENSE', 'FaBolt', '#FFC107', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Entertainment', 'EXPENSE', 'FaGamepad', '#E91E63', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Shopping', 'EXPENSE', 'FaShoppingBag', '#9C27B0', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Healthcare', 'EXPENSE', 'FaHeartbeat', '#F44336', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Education', 'EXPENSE', 'FaGraduationCap', '#3F51B5', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Travel', 'EXPENSE', 'FaPlane', '#2196F3', NULL) ON CONFLICT DO NOTHING;
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Subscriptions', 'EXPENSE', 'FaReceipt', '#607D8B', NULL) ON CONFLICT DO NOTHING;

-- Demo User (password: "demo123" hashed with BCrypt)
INSERT INTO users (username, email, password, created_at) VALUES ('demo', 'demo@financetracker.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;

-- Demo Transactions for user 1 (current month and previous months)
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 5000.00, 'Salary', 'Monthly salary - July', CURRENT_DATE, 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 1200.00, 'Freelance', 'Web development project', CURRENT_DATE - INTERVAL '2 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 350.00, 'Investments', 'Dividend payment', CURRENT_DATE - INTERVAL '5 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', CURRENT_DATE - INTERVAL '1 day', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 120.00, 'Food & Dining', 'Groceries - weekly', CURRENT_DATE - INTERVAL '1 day', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 45.00, 'Transportation', 'Gas refill', CURRENT_DATE - INTERVAL '3 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 200.00, 'Utilities', 'Electricity & Internet', CURRENT_DATE - INTERVAL '4 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 80.00, 'Entertainment', 'Movie night + dinner', CURRENT_DATE - INTERVAL '6 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 150.00, 'Shopping', 'New running shoes', CURRENT_DATE - INTERVAL '7 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 60.00, 'Healthcare', 'Pharmacy', CURRENT_DATE - INTERVAL '8 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 15.00, 'Subscriptions', 'Netflix', CURRENT_DATE - INTERVAL '10 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 35.00, 'Food & Dining', 'Coffee shop', CURRENT_DATE - INTERVAL '9 days', 1) ON CONFLICT DO NOTHING;

-- Previous month transactions
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 5000.00, 'Salary', 'Monthly salary - June', CURRENT_DATE - INTERVAL '1 month', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 800.00, 'Freelance', 'Logo design', CURRENT_DATE - INTERVAL '35 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', CURRENT_DATE - INTERVAL '32 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 180.00, 'Food & Dining', 'Groceries', CURRENT_DATE - INTERVAL '33 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 95.00, 'Transportation', 'Uber rides', CURRENT_DATE - INTERVAL '36 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 250.00, 'Shopping', 'Electronics', CURRENT_DATE - INTERVAL '38 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 500.00, 'Travel', 'Weekend trip', CURRENT_DATE - INTERVAL '40 days', 1) ON CONFLICT DO NOTHING;

-- 2 months ago
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 5000.00, 'Salary', 'Monthly salary - May', CURRENT_DATE - INTERVAL '2 months', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', CURRENT_DATE - INTERVAL '2 months', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 200.00, 'Utilities', 'Bills', CURRENT_DATE - INTERVAL '65 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 300.00, 'Entertainment', 'Concert tickets', CURRENT_DATE - INTERVAL '60 days', 1) ON CONFLICT DO NOTHING;

-- 3 months ago
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 4800.00, 'Salary', 'Monthly salary - Apr', CURRENT_DATE - INTERVAL '3 months', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 500.00, 'Investments', 'Stock gains', CURRENT_DATE - INTERVAL '95 days', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', CURRENT_DATE - INTERVAL '3 months', 1) ON CONFLICT DO NOTHING;
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 400.00, 'Education', 'Online course', CURRENT_DATE - INTERVAL '90 days', 1) ON CONFLICT DO NOTHING;

-- Demo Budgets for current month
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Food & Dining', 300.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), 1) ON CONFLICT DO NOTHING;
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Transportation', 150.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), 1) ON CONFLICT DO NOTHING;
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Entertainment', 200.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), 1) ON CONFLICT DO NOTHING;
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Shopping', 250.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), 1) ON CONFLICT DO NOTHING;
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Utilities', 180.00, TO_CHAR(CURRENT_DATE, 'YYYY-MM'), 1) ON CONFLICT DO NOTHING;
