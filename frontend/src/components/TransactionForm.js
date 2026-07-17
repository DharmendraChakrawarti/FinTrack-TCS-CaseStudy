import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import './TransactionForm.css';

const EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transportation', 'Housing', 'Utilities',
  'Entertainment', 'Shopping', 'Healthcare', 'Education',
  'Travel', 'Subscriptions'
];

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Other Income'];

const TransactionForm = ({ onSubmit, onClose, editData = null }) => {
  const [form, setForm] = useState({
    type: 'EXPENSE',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editData) {
      setForm({
        type: editData.type,
        amount: editData.amount.toString(),
        category: editData.category,
        description: editData.description || '',
        date: editData.date,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.date) return;

    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });
  };

  const categories = form.type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="transaction-form glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="transaction-form__header">
          <h3>{editData ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button className="btn btn-icon btn-secondary" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="input-label">Type</label>
            <div className="type-toggle">
              <button
                type="button"
                className={`type-btn ${form.type === 'EXPENSE' ? 'active expense' : ''}`}
                onClick={() => handleChange({ target: { name: 'type', value: 'EXPENSE' } })}
              >
                Expense
              </button>
              <button
                type="button"
                className={`type-btn ${form.type === 'INCOME' ? 'active income' : ''}`}
                onClick={() => handleChange({ target: { name: 'type', value: 'INCOME' } })}
              >
                Income
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Amount</label>
              <input
                type="number"
                name="amount"
                className="input-field"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                required
                id="transaction-amount"
              />
            </div>
            <div className="form-group">
              <label className="input-label">Date</label>
              <input
                type="date"
                name="date"
                className="input-field"
                value={form.date}
                onChange={handleChange}
                required
                id="transaction-date"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Category</label>
            <select
              name="category"
              className="input-field"
              value={form.category}
              onChange={handleChange}
              required
              id="transaction-category"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="input-label">Description (optional)</label>
            <input
              type="text"
              name="description"
              className="input-field"
              placeholder="What was this for?"
              value={form.description}
              onChange={handleChange}
              id="transaction-description"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" id="transaction-submit">
              {editData ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
