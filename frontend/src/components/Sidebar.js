import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaChartPie, FaExchangeAlt, FaBullseye, FaFileExport, FaSignOutAlt, FaWallet, FaBars, FaTimes } from 'react-icons/fa';
import authService from '../services/authService';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: <FaChartPie />, label: 'Dashboard' },
    { path: '/transactions', icon: <FaExchangeAlt />, label: 'Transactions' },
    { path: '/budgets', icon: <FaBullseye />, label: 'Budgets' },
    { path: '/reports', icon: <FaFileExport />, label: 'Reports' },
  ];

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        id="mobile-menu-btn"
        aria-label="Open navigation menu"
      >
        <FaBars />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          id="sidebar-overlay"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`} id="app-sidebar">
        {/* Mobile close button */}
        <button
          className="mobile-close-btn"
          onClick={() => setMobileOpen(false)}
          id="mobile-close-btn"
          aria-label="Close navigation menu"
        >
          <FaTimes />
        </button>

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaWallet className="logo-icon" />
            <span className="logo-text">FinTrack</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase()}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username || 'User'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} id="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
