import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown, FaBalanceScale } from 'react-icons/fa';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import dashboardService from '../services/dashboardService';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import Loader from '../components/Loader';
import './Dashboard.css';

const CHART_COLORS = ['#00d2ff', '#7a5cfa', '#ff5252', '#00e676', '#ffab40', '#e91e63', '#2196f3', '#ff9800', '#9c27b0', '#4caf50'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ${Number(entry.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await dashboardService.getDashboard();
      setData(response);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!data) return <div className="error-state">Failed to load dashboard data</div>;

  return (
    <div className="dashboard-page animate-fade-in" id="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your financial overview for this month</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Income"
          value={data.totalIncome}
          icon={<FaArrowUp />}
          type="income"
        />
        <StatCard
          title="Total Expenses"
          value={data.totalExpenses}
          icon={<FaArrowDown />}
          type="expense"
        />
        <StatCard
          title="Net Balance"
          value={data.balance}
          icon={<FaBalanceScale />}
          type="balance"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Expense Breakdown Pie Chart */}
        <ChartCard title="Expense Breakdown" className="chart-pie">
          {data.expenseByCategory && data.expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.expenseByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {data.expenseByCategory.map((entry, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{
                    background: 'rgba(15, 15, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e8e8f0'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No expense data this month</p>
          )}
        </ChartCard>

        {/* Monthly Trend Line Chart */}
        <ChartCard title="Income vs. Expenses (6 Months)" className="chart-trend">
          {data.monthlyTrend && data.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#9595b0" fontSize={12} />
                <YAxis stroke="#9595b0" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#00e676"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#00e676' }}
                  activeDot={{ r: 6 }}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ff5252"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#ff5252' }}
                  activeDot={{ r: 6 }}
                  name="Expense"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No trend data available</p>
          )}
        </ChartCard>
      </div>

      {/* Income Bar Chart + Recent Transactions */}
      <div className="charts-grid">
        <ChartCard title="Income Sources" className="chart-bar">
          {data.incomeByCategory && data.incomeByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.incomeByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#9595b0" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" stroke="#9595b0" fontSize={12} width={100} />
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  contentStyle={{
                    background: 'rgba(15, 15, 35, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e8e8f0'
                  }}
                />
                <Bar dataKey="value" fill="url(#incomeGradient)" radius={[0, 6, 6, 0]} barSize={24} name="Amount">
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#00d2ff" />
                      <stop offset="100%" stopColor="#00e676" />
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No income data this month</p>
          )}
        </ChartCard>

        {/* Recent Transactions */}
        <ChartCard title="Recent Transactions" className="chart-recent">
          <div className="recent-list">
            {data.recentTransactions && data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((txn) => (
                <div key={txn.id} className="recent-item">
                  <div className="recent-item__info">
                    <span className="recent-item__category">{txn.category}</span>
                    <span className="recent-item__desc">{txn.description || txn.category}</span>
                  </div>
                  <span className={`recent-item__amount ${txn.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                    {txn.type === 'INCOME' ? '+' : '-'}${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-data">No recent transactions</p>
            )}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
