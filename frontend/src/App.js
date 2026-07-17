import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={isAuthPage ? '' : 'app-layout'}>
      {!isAuthPage && <Sidebar />}

      <main className={isAuthPage ? '' : 'main-content'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute><Transactions /></ProtectedRoute>
          } />
          <Route path="/budgets" element={
            <ProtectedRoute><Budgets /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute><Reports /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
