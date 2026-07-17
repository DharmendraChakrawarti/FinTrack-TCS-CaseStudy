import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaFilter } from 'react-icons/fa';
import transactionService from '../services/transactionService';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import Loader from '../components/Loader';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: '',
  });

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate && filters.endDate) {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
      }
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;

      const data = await transactionService.getAll(params);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleSubmit = async (formData) => {
    try {
      if (editData) {
        await transactionService.update(editData.id, formData);
      } else {
        await transactionService.create(formData);
      }
      setShowForm(false);
      setEditData(null);
      loadTransactions();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (txn) => {
    setEditData(txn);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await transactionService.delete(id);
      loadTransactions();
    } catch (error) {
      alert('Failed to delete transaction');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditData(null);
  };

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', type: '', category: '' });
  };

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transactions-page animate-fade-in" id="transactions-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Manage your income and expenses</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)} id="toggle-filters">
            <FaFilter /> Filters
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(true)} id="add-transaction">
            <FaPlus /> Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="transactions-summary">
        <div className="summary-item">
          <span className="summary-label">Total Income</span>
          <span className="summary-value text-income">+${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <span className="summary-label">Total Expenses</span>
          <span className="summary-value text-expense">-${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-item">
          <span className="summary-label">Showing</span>
          <span className="summary-value">{transactions.length} transactions</span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-panel glass-card animate-fade-in">
          <div className="filters-grid">
            <div className="form-group">
              <label className="input-label">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">End Date</label>
              <input
                type="date"
                className="input-field"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="input-label">Type</label>
              <select
                className="input-field"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="form-group filter-actions">
              <label className="input-label">&nbsp;</label>
              <button className="btn btn-secondary" onClick={clearFilters}>Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      {loading ? (
        <Loader />
      ) : (
        <TransactionTable
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          editData={editData}
        />
      )}
    </div>
  );
};

export default Transactions;
