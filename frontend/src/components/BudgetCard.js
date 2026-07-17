import React from 'react';
import './BudgetCard.css';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { categoryName, monthlyLimit, spent, remaining, percentUsed, overBudget } = budget;

  const progressWidth = Math.min(percentUsed, 100);
  const statusClass = overBudget ? 'over' : percentUsed > 80 ? 'warning' : 'normal';

  return (
    <div className={`budget-card glass-card budget-card--${statusClass}`} id={`budget-${categoryName.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="budget-card__header">
        <h4 className="budget-card__category">{categoryName}</h4>
        <div className="budget-card__actions">
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(budget)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(budget.id)}>Delete</button>
        </div>
      </div>

      <div className="budget-card__progress-container">
        <div className="budget-card__progress-bar">
          <div
            className={`budget-card__progress-fill budget-card__progress-fill--${statusClass}`}
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        <span className="budget-card__percent">{percentUsed.toFixed(1)}%</span>
      </div>

      <div className="budget-card__details">
        <div className="budget-card__detail">
          <span className="budget-card__label">Spent</span>
          <span className="budget-card__value text-expense">${spent?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="budget-card__detail">
          <span className="budget-card__label">Limit</span>
          <span className="budget-card__value">${monthlyLimit?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="budget-card__detail">
          <span className="budget-card__label">Remaining</span>
          <span className={`budget-card__value ${remaining < 0 ? 'text-expense' : 'text-income'}`}>
            ${Math.abs(remaining || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {overBudget && (
        <div className="budget-card__alert">
          ⚠️ Over budget by ${Math.abs(remaining).toFixed(2)}
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
