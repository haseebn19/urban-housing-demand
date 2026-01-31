import React from 'react';
import {useTheme} from '../ThemeContext';
import './Navbar.css';

type PageType = 'pitch' | 'starts' | 'occupations' | 'family' | 'immigration';

interface NavbarProps {
  currentPage: PageType;
  setPage: (page: PageType) => void;
}

const NAV_ITEMS: {key: PageType; label: string}[] = [
  {key: 'pitch', label: 'Overview'},
  {key: 'starts', label: 'Housing'},
  {key: 'occupations', label: 'Occupations'},
  {key: 'family', label: 'Family Types'},
  {key: 'immigration', label: 'Immigration'},
];

const Navbar: React.FC<NavbarProps> = ({currentPage, setPage}) => {
  const {theme, toggleTheme} = useTheme();

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar__brand">
        <span className="navbar__logo">UHD</span>
        <span className="navbar__title">Urban Housing Demand</span>
      </div>

      <div className="navbar__links">
        {NAV_ITEMS.map(({key, label}) => (
          <button
            key={key}
            className={`navbar__link ${currentPage === key ? 'navbar__link--active' : ''}`}
            onClick={() => setPage(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        className="navbar__theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
