-- Default Categories (system-level, userId = NULL)
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Salary', 'INCOME', 'FaBriefcase', '#4CAF50', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Freelance', 'INCOME', 'FaLaptop', '#8BC34A', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Investments', 'INCOME', 'FaChartLine', '#00BCD4', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Other Income', 'INCOME', 'FaWallet', '#009688', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Food & Dining', 'EXPENSE', 'FaUtensils', '#FF5722', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Transportation', 'EXPENSE', 'FaCar', '#FF9800', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Housing', 'EXPENSE', 'FaHome', '#795548', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Utilities', 'EXPENSE', 'FaBolt', '#FFC107', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Entertainment', 'EXPENSE', 'FaGamepad', '#E91E63', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Shopping', 'EXPENSE', 'FaShoppingBag', '#9C27B0', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Healthcare', 'EXPENSE', 'FaHeartbeat', '#F44336', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Education', 'EXPENSE', 'FaGraduationCap', '#3F51B5', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Travel', 'EXPENSE', 'FaPlane', '#2196F3', NULL);
INSERT INTO categories (name, type, icon, color, user_id) VALUES ('Subscriptions', 'EXPENSE', 'FaReceipt', '#607D8B', NULL);

-- Demo User (password: "demo123" hashed with BCrypt)
INSERT INTO users (username, email, password, created_at) VALUES ('demo', 'demo@financetracker.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', CURRENT_TIMESTAMP);

-- Demo Transactions for user 1 (current month and previous months)
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 5000.00, 'Salary', 'Monthly salary - July', CURRENT_DATE, 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 1200.00, 'Freelance', 'Web development project', DATEADD('DAY', -2, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 350.00, 'Investments', 'Dividend payment', DATEADD('DAY', -5, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', DATEADD('DAY', -1, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 120.00, 'Food & Dining', 'Groceries - weekly', DATEADD('DAY', -1, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 45.00, 'Transportation', 'Gas refill', DATEADD('DAY', -3, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 200.00, 'Utilities', 'Electricity & Internet', DATEADD('DAY', -4, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 80.00, 'Entertainment', 'Movie night + dinner', DATEADD('DAY', -6, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 150.00, 'Shopping', 'New running shoes', DATEADD('DAY', -7, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 60.00, 'Healthcare', 'Pharmacy', DATEADD('DAY', -8, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 15.00, 'Subscriptions', 'Netflix', DATEADD('DAY', -10, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 35.00, 'Food & Dining', 'Coffee shop', DATEADD('DAY', -9, CURRENT_DATE), 1);

-- Previous month transactions
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 5000.00, 'Salary', 'Monthly salary - June', DATEADD('MONTH', -1, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 800.00, 'Freelance', 'Logo design', DATEADD('DAY', -35, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', DATEADD('DAY', -32, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 180.00, 'Food & Dining', 'Groceries', DATEADD('DAY', -33, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 95.00, 'Transportation', 'Uber rides', DATEADD('DAY', -36, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 250.00, 'Shopping', 'Electronics', DATEADD('DAY', -38, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 500.00, 'Travel', 'Weekend trip', DATEADD('DAY', -40, CURRENT_DATE), 1);

-- 2 months ago
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 5000.00, 'Salary', 'Monthly salary - May', DATEADD('MONTH', -2, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', DATEADD('MONTH', -2, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 200.00, 'Utilities', 'Bills', DATEADD('DAY', -65, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 300.00, 'Entertainment', 'Concert tickets', DATEADD('DAY', -60, CURRENT_DATE), 1);

-- 3 months ago
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 4800.00, 'Salary', 'Monthly salary - Apr', DATEADD('MONTH', -3, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('INCOME', 500.00, 'Investments', 'Stock gains', DATEADD('DAY', -95, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 850.00, 'Housing', 'Monthly rent', DATEADD('MONTH', -3, CURRENT_DATE), 1);
INSERT INTO transactions (type, amount, category, description, date, user_id) VALUES ('EXPENSE', 400.00, 'Education', 'Online course', DATEADD('DAY', -90, CURRENT_DATE), 1);

-- Demo Budgets for current month
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Food & Dining', 300.00, FORMATDATETIME(CURRENT_DATE, 'yyyy-MM'), 1);
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Transportation', 150.00, FORMATDATETIME(CURRENT_DATE, 'yyyy-MM'), 1);
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Entertainment', 200.00, FORMATDATETIME(CURRENT_DATE, 'yyyy-MM'), 1);
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Shopping', 250.00, FORMATDATETIME(CURRENT_DATE, 'yyyy-MM'), 1);
INSERT INTO budgets (category_name, monthly_limit, budget_month, user_id) VALUES ('Utilities', 180.00, FORMATDATETIME(CURRENT_DATE, 'yyyy-MM'), 1);
