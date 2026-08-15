import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function BrowseNavbar({ 
  activeTab = 'home', 
  onTabChange, 
  searchQuery = '', 
  onSearchChange 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navTabs = [
    { id: 'home', label: 'Home' },
    { id: 'tv', label: 'TV Shows' },
    { id: 'movies', label: 'Movies' },
    { id: 'new', label: 'New & Popular' },
    { id: 'mylist', label: 'My List' },
    { id: 'language', label: 'Browse by Language' },
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Arrival: Stranger Things Season 5',
      time: '1 day ago',
      image: 'https://image.tmdb.org/t/p/w200/56v2ox9aPWc9v5VqNXvdFvRzLCS.jpg',
    },
    {
      id: 2,
      title: 'Top 10 Today: Money Heist',
      time: '2 days ago',
      image: 'https://image.tmdb.org/t/p/w200/reKs8U40qrip8xp4i79y5B1XzG0.jpg',
    },
    {
      id: 3,
      title: 'Recommended for you: Wednesday',
      time: '3 days ago',
      image: 'https://image.tmdb.org/t/p/w200/9PFonQ95165agAImGZq15hY99q2.jpg',
    },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--black' : 'navbar--transparent'}`}>
      <div className="navbar__left">
        <Link to="/browse" onClick={() => onTabChange && onTabChange('home')} className="netflix-wordmark">
          NETFLIX
        </Link>
        <ul className="navbar__links">
          {navTabs.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                className={`navbar__link ${activeTab === tab.id ? 'navbar__link--active' : ''}`}
                onClick={() => {
                  if (onTabChange) onTabChange(tab.id);
                  if (tab.id !== 'home' && searchQuery) {
                    onSearchChange && onSearchChange('');
                  }
                }}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar__right">
        {/* Search Bar */}
        <div className="navbar__search">
          {showSearch ? (
            <div className="navbar__search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#e5e5e5', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="navbar__search-input"
                placeholder="Titles, people, genres"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              />
              {searchQuery ? (
                <button
                  type="button"
                  className="navbar__search-close"
                  onClick={() => onSearchChange && onSearchChange('')}
                >
                  ✕
                </button>
              ) : (
                <button
                  type="button"
                  className="navbar__search-close"
                  onClick={() => setShowSearch(false)}
                >
                  ✕
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="navbar__icon-btn"
              onClick={() => setShowSearch(true)}
              title="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Notifications */}
        <div 
          className="navbar__notifications"
          onMouseEnter={() => setShowNotifications(true)}
          onMouseLeave={() => setShowNotifications(false)}
        >
          <button type="button" className="navbar__icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="navbar__badge">3</span>
          </button>

          {showNotifications && (
            <div className="notifications-menu">
              <div className="notifications-menu__header">Notifications</div>
              <ul className="notifications-menu__list">
                {notifications.map((n) => (
                  <li key={n.id} className="notification-item">
                    <img 
                      src={n.image} 
                      alt="" 
                      className="notification-item__thumb" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="notification-item__content">
                      <div className="notification-item__title">{n.title}</div>
                      <div className="notification-item__time">{n.time}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div 
          className="navbar__profile"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
          style={{ position: 'relative' }}
        >
          <div style={{
            width: '32px', 
            height: '32px', 
            backgroundColor: '#e50914', 
            borderRadius: '4px', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'white'
          }}>
            {user?.email?.[0]?.toUpperCase() || 'S'}
          </div>
          
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: '210px',
              backgroundColor: 'rgba(0,0,0,0.95)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              padding: '8px 0',
              marginTop: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
              zIndex: 9999,
            }}>
              <div style={{
                padding: '10px 16px',
                color: '#b3b3b3',
                fontSize: '0.85rem',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                wordBreak: 'break-all'
              }}>
                <div style={{ color: 'white', fontWeight: '600', marginBottom: '2px' }}>
                  {user?.email?.split('@')[0] || 'User'}
                </div>
                {user?.email}
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Sign out of Netflix
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
