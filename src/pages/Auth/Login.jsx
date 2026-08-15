import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-page__overlay" />

      <div className="auth-page__nav">
        <Link to="/" className="netflix-wordmark">NETFLIX</Link>
      </div>

      <div className="auth-page__card">
        <h1 className="auth-page__title">Sign In</h1>

        {error && <div className="auth-form__error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__input-group">
            <input
              type="email"
              className="auth-form__input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form__input-group">
            <input
              type="password"
              className="auth-form__input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="auth-form__submit"
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="auth-form__checkbox">
            <input 
              type="checkbox" 
              id="remember" 
              checked={remember} 
              onChange={(e) => setRemember(e.target.checked)} 
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <div className="auth-form__footer">
            <p>New to Netflix? <Link to="/signup">Sign up now</Link>.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
