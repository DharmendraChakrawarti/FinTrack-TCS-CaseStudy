import React, { useState } from 'react';
import { FaFileCsv, FaFilePdf, FaDownload } from 'react-icons/fa';
import exportService from '../services/exportService';
import './Reports.css';

const Reports = () => {
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [downloading, setDownloading] = useState('');

  const handleExportCsv = async () => {
    if (!startDate || !endDate) {
      alert('Please select a date range');
      return;
    }
    setDownloading('csv');
    try {
      await exportService.downloadCsv(startDate, endDate);
    } catch (error) {
      alert('Failed to download CSV');
    } finally {
      setDownloading('');
    }
  };

  const handleExportPdf = async () => {
    if (!startDate || !endDate) {
      alert('Please select a date range');
      return;
    }
    setDownloading('pdf');
    try {
      await exportService.downloadPdf(startDate, endDate);
    } catch (error) {
      alert('Failed to download PDF');
    } finally {
      setDownloading('');
    }
  };

  // Quick date range presets
  const setPreset = (preset) => {
    const now = new Date();
    let start, end;

    switch (preset) {
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = now;
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'last3Months':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        end = now;
        break;
      case 'thisYear':
        start = new Date(now.getFullYear(), 0, 1);
        end = now;
        break;
      default:
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="reports-page animate-fade-in" id="reports-page">
      <div className="page-header">
        <h1>Reports & Export</h1>
        <p>Generate and download your financial reports</p>
      </div>

      <div className="reports-content">
        {/* Date Range Selector */}
        <div className="report-section glass-card">
          <h3 className="section-title">Select Date Range</h3>

          <div className="preset-buttons">
            <button className="btn btn-secondary btn-sm" onClick={() => setPreset('thisMonth')}>This Month</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setPreset('lastMonth')}>Last Month</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setPreset('last3Months')}>Last 3 Months</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setPreset('thisYear')}>This Year</button>
          </div>

          <div className="date-range-grid">
            <div className="form-group">
              <label className="input-label">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                id="report-start-date"
              />
            </div>
            <div className="form-group">
              <label className="input-label">End Date</label>
              <input
                type="date"
                className="input-field"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                id="report-end-date"
              />
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="export-cards">
          <div className="export-card glass-card" id="export-csv-card">
            <div className="export-card__icon csv-icon">
              <FaFileCsv />
            </div>
            <div className="export-card__info">
              <h4>CSV Report</h4>
              <p>Spreadsheet-compatible format. Perfect for Excel, Google Sheets, or further data analysis.</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleExportCsv}
              disabled={downloading === 'csv'}
              id="export-csv-btn"
            >
              {downloading === 'csv' ? (
                <span className="auth-loading-spinner"></span>
              ) : (
                <>
                  <FaDownload /> Download CSV
                </>
              )}
            </button>
          </div>

          <div className="export-card glass-card" id="export-pdf-card">
            <div className="export-card__icon pdf-icon">
              <FaFilePdf />
            </div>
            <div className="export-card__info">
              <h4>PDF Report</h4>
              <p>Professionally formatted report with summary statistics. Great for printing or sharing.</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleExportPdf}
              disabled={downloading === 'pdf'}
              id="export-pdf-btn"
            >
              {downloading === 'pdf' ? (
                <span className="auth-loading-spinner"></span>
              ) : (
                <>
                  <FaDownload /> Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
