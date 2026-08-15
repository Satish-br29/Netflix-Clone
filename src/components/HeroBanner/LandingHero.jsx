import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroBanner.css';

export default function LandingHero() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email && email.trim()) {
      navigate('/login', { state: { email: email.trim() } });
    }
  };

  return (
    <div className="hero hero--landing">
      <div 
        className="hero__background"
        style={{ 
          backgroundImage: `url('/landing-bg.jpg')`
        }}
      />
      <div className="hero__overlay" />
      
      <div className="hero__content hero__content--center">
        <h1 className="hero__title--large">Unlimited movies, shows, and more</h1>
        <h2 className="hero__subtitle">Starts at ₹149. Cancel at any time.</h2>
        <p style={{fontSize: '1.1rem', marginBottom: '8px'}}>Ready to watch? Enter your email to create or restart your membership.</p>
        
        <form className="email-cta" onSubmit={handleGetStarted}>
          <input 
            type="email" 
            placeholder="Email address" 
            className="email-cta__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="email-cta__button">
            Get Started <span style={{marginLeft: '8px'}}>›</span>
          </button>
        </form>
      </div>
    </div>
  );
}
