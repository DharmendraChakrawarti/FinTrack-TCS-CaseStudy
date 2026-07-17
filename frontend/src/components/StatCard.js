import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, type, prefix = '$' }) => {
  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '0.00';

  return (
    <div className={`stat-card stat-card--${type}`} id={`stat-${type}`}>
      <div className="stat-card__header">
        <span className="stat-card__icon">{icon}</span>
        <span className="stat-card__title">{title}</span>
      </div>
      <div className="stat-card__value">
        <span className="stat-card__prefix">{prefix}</span>
        <span className="stat-card__number">{formattedValue}</span>
      </div>
      <div className="stat-card__glow"></div>
    </div>
  );
};

export default StatCard;
