const TABS = ['Home', 'History'];

export default function NavBar({ activeTab, onTabChange }) {
  return (
    <nav className="navbar">
      {TABS.map((tab) => (
        <button
          key={tab}
          className={tab === activeTab ? 'navbar__tab navbar__tab--active' : 'navbar__tab'}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
