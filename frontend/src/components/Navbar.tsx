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

      <button className="navbar__theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
};

export default Navbar;
