import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--black' : 'navbar--transparent'}`}>
      <div className="navbar__left">
        <Link to="/" className="netflix-wordmark">NETFLIX</Link>
      </div>
      <div className="navbar__right">
        <select className="lang-dropdown">
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
        <Link to="/login" className="btn-signin">Sign In</Link>
      </div>
    </nav>
  );
}
