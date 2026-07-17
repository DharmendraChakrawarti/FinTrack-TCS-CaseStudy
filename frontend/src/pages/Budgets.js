import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import budgetService from '../services/budgetService';
import BudgetCard from '../components/BudgetCard';
import Loader from '../components/Loader';
import './Budgets.css';

const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Housing', 'Utilities',
  'Entertainment', 'Shopping', 'Healthcare', 'Education',
  'Travel', 'Subscriptions'
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [form, setForm] = useState({
    categoryName: '',
    monthlyLimit: '',
    month: '',
  });

  const loadBudgets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await budgetService.getByMonth(selectedMonth);
      setBudgets(data);
    } catch (error) {
      console.error('Failed to load budgets:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  const openAddForm = () => {
    setEditData(null);
    setForm({ categoryName: '', monthlyLimit: '', month: selectedMonth });
    setShowForm(true);
  };

  const openEditForm = (budget) => {
    setEditData(budget);
    setForm({
      categoryName: budget.categoryName,
      monthlyLimit: budget.monthlyLimit.toString(),
      month: budget.month,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryName || !form.monthlyLimit) return;

    try {
      const payload = {
        categoryName: form.categoryName,
        monthlyLimit: parseFloat(form.monthlyLimit),
        month: form.month || selectedMonth,
      };

      if (editData) {
        await budgetService.update(editData.id, payload);
      } else {
        await budgetService.create(payload);
      }

      setShowForm(false);
      setEditData(null);
      loadBudgets();
    } catch (error) {
      alert(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await budgetService.delete(id);
      loadBudgets();
    } catch (error) {
      alert('Failed to delete budget');
    }
  };

  const overBudgetCount = budgets.filter(b => b.overBudget).length;
  const usedCategories = budgets.map(b => b.categoryName);
  const availableCategories = EXPENSE_CATEGORIES.filter(c => !usedCategories.includes(c));

  return (
    <div className="budgets-page animate-fade-in" id="budgets-page">
      <div className="page-header">
        <div>
          <h1>Budget Analytics</h1>
          <p>Set spending limits and track your budgets</p>
        </div>
        <div className="page-actions">
          <input
            type="month"
            className="input-field month-picker"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            id="budget-month-picker"
          />
          <button className="btn btn-primary" onClick={openAddForm} id="add-budget">
            <FaPlus /> Add Budget
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {budgets.length > 0 && (
        <div className="budget-status-bar">
          <div className="status-item">
            <span className="status-count">{budgets.length}</span>
            <span className="status-label">Active Budgets</span>
          </div>
          {overBudgetCount > 0 && (
            <div className="status-item status-warning">
              <span className="status-count">{overBudgetCount}</span>
              <span className="status-label">Over Budget</span>
            </div>
          )}
        </div>
      )}

      {/* Budget Cards */}
      {loading ? (
        <Loader />
      ) : budgets.length > 0 ? (
        <div className="budgets-grid">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card">
          <p>No budgets set for {selectedMonth}</p>
          <span>Create your first budget to start tracking spending limits</span>
          <button className="btn btn-primary mt-md" onClick={openAddForm}>
            <FaPlus /> Create Budget
          </button>
        </div>
      )}

      {/* Add/Edit Budget Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="budget-form glass-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editData ? 'Edit Budget' : 'Add Budget'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="input-label">Category</label>
                <select
                  className="input-field"
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  required
                  disabled={!!editData}
                  id="budget-category"
                >
                  <option value="">Select category</option>
                  {(editData ? EXPENSE_CATEGORIES : availableCategories).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Monthly Limit ($)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  value={form.monthlyLimit}
                  onChange={(e) => setForm({ ...form, monthlyLimit: e.target.value })}
                  step="0.01"
                  min="1"
                  required
                  id="budget-limit"
                />
              </div>

              <div className="form-group">
                <label className="input-label">Month</label>
                <input
                  type="month"
                  className="input-field"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                  required
                  id="budget-month"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" id="budget-submit">
                  {editData ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
