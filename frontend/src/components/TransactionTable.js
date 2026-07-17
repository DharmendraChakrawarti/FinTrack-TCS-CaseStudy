import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './TransactionTable.css';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <p>No transactions found</p>
        <span>Add your first transaction to get started</span>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="transaction-table" id="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={txn.id} style={{ animationDelay: `${index * 0.03}s` }}>
              <td className="date-cell">{formatDate(txn.date)}</td>
              <td>
                <span className={`badge badge-${txn.type.toLowerCase()}`}>
                  {txn.type}
                </span>
              </td>
              <td className="category-cell">{txn.category}</td>
              <td className="desc-cell">{txn.description || '—'}</td>
              <td className={`amount-cell ${txn.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                {txn.type === 'INCOME' ? '+' : '-'}${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </td>
              <td className="actions-cell">
                <button className="btn btn-icon btn-secondary" onClick={() => onEdit(txn)} title="Edit">
                  <FaEdit />
                </button>
                <button className="btn btn-icon btn-danger" onClick={() => onDelete(txn.id)} title="Delete">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
