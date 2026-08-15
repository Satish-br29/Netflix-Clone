import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export default function Signup() {
  const location = useLocation();
  const passedEmail = location.state?.email || '';
  const [step, setStep] = useState(passedEmail && passedEmail.includes('@') ? 2 : 1);
  const [email, setEmail] = useState(passedEmail);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, loginEmailOnly } = useAuth();
  const navigate = useNavigate();

  // const handleStep1 = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   if (!email || !email.includes('@')) {
  //     setError('Please enter a valid email address.');
  //     return;
  //   }
  //   setSubmitting(true);
  //   try {
  //     const res = await loginEmailOnly(email.trim());
  //     if (res.success) {
  //       navigate('/browse');
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 404) {
  //       setStep(2);
  //     } else {
  //       setError('An error occurred. Please try again.');
  //     }
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  // src/pages/Signup.jsx

  // Update handleStep1 inside Signup component:
  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      // Call check-email endpoint directly or via AuthContext helper
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.exists) {
          // If email already exists, prompt user to log in instead
          setError('An account with this email already exists. Please sign in.');
        } else {
          // Email does not exist; proceed to password creation
          setStep(2);
        }
      } else {
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError('');
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setStep(3);
  };

  const handleStep3 = async () => {
    setError('');
    setSubmitting(true);
    try {
      await register(email.trim(), password);
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setStep(1);
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
        {error && <div className="auth-form__error">{error}</div>}

        {step === 1 && (
          <div className="signup-step">
            <div className="signup-step__icon">📧</div>
            <p className="signup-step__counter">Step 1 of 3</p>
            <h2 className="signup-step__heading">Create a password to start your membership</h2>
            <p className="signup-step__text">Just a few more steps and you're done! We hate paperwork, too.</p>
            <form className="auth-form" onSubmit={handleStep1}>
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
              <button type="submit" className="auth-form__submit" disabled={submitting}>
                {submitting ? 'Checking...' : 'Next'}
              </button>
            </form>
            <div className="auth-form__footer" style={{ marginTop: '24px' }}>
              <p>Already have an account? <Link to="/login">Sign in</Link>.</p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="signup-step">
            <div className="signup-step__icon">🔒</div>
            <p className="signup-step__counter">Step 2 of 3</p>
            <h2 className="signup-step__heading">Create a password</h2>
            <p className="signup-step__text">Add a password so you can log in next time.</p>
            <form className="auth-form" onSubmit={handleStep2}>
              <div className="auth-form__input-group">
                <input
                  type="email"
                  className="auth-form__input"
                  placeholder="Email address"
                  value={email}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="auth-form__input-group">
                <input
                  type="password"
                  className="auth-form__input"
                  placeholder="Add a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
              <button type="submit" className="auth-form__submit">Next</button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="signup-step">
            <div className="signup-step__icon">✅</div>
            <p className="signup-step__counter">Step 3 of 3</p>
            <h2 className="signup-step__heading">You're almost done!</h2>
            <p className="signup-step__text">Click below to create your account and start watching.</p>
            <button
              className="auth-form__submit"
              onClick={handleStep3}
              disabled={submitting}
              style={{ marginTop: 0 }}
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
