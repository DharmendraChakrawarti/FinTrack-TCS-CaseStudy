import React from 'react';
import './ChartCard.css';

const ChartCard = ({ title, children, className = '' }) => {
  return (
    <div className={`chart-card glass-card ${className}`}>
      <div className="chart-card__header">
        <h3 className="chart-card__title">{title}</h3>
      </div>
      <div className="chart-card__body">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
