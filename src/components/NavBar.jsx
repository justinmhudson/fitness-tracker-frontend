import { useState } from 'react';

const TABS = ['Cardio', 'Upper Body', 'Lower Body', 'Other', 'Calendar'];

export default function NavBar({ activeTab, onTabChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleTabClick(tab) {
    onTabChange(tab);
    setMenuOpen(false); // close the menu after picking a tab, on mobile
  }

  return (
    <nav className="navbar">
      {/* Only visible on narrow screens — see the media query in index.css */}
      <button
        type="button"
        className="navbar__hamburger"
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
      >
        <span className="navbar__hamburger-label">{activeTab}</span>
        <span className={menuOpen ? 'navbar__hamburger-icon navbar__hamburger-icon--open' : 'navbar__hamburger-icon'}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <div className={menuOpen ? 'navbar__tabs navbar__tabs--open' : 'navbar__tabs'}>
        {TABS.map((tab) => (
          <button
            key={tab}
            className={tab === activeTab ? 'navbar__tab navbar__tab--active' : 'navbar__tab'}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
}
