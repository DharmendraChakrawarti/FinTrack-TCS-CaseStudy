import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWallet, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await authService.login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FaWallet />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your FinTrack account</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-group">
            <FaUser className="auth-input-icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="auth-input"
              id="login-username"
              autoComplete="username"
            />
          </div>

          <div className="auth-input-group">
            <FaLock className="auth-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              id="login-password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="auth-submit" disabled={loading} id="login-submit">
            {loading ? (
              <span className="auth-loading-spinner"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Create one</Link></p>
        </div>

        <div className="auth-demo-hint">
          <p>Demo: <strong>demo</strong> / <strong>demo123</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
