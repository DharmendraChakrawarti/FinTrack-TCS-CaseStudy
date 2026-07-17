import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWallet, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import authService from '../services/authService';
import './Login.css'; // reuse same auth styles

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authService.signup(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="signup-page">
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
          <h1>Create Account</h1>
          <p>Start tracking your finances today</p>
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
              id="signup-username"
              autoComplete="username"
            />
          </div>

          <div className="auth-input-group">
            <FaEnvelope className="auth-input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="auth-input"
              id="signup-email"
              autoComplete="email"
            />
          </div>

          <div className="auth-input-group">
            <FaLock className="auth-input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={handleChange}
              className="auth-input"
              id="signup-password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" className="auth-submit" disabled={loading} id="signup-submit">
            {loading ? (
              <span className="auth-loading-spinner"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
