const navigationItems = [
  "Home",
  "Live",
  "History",
  "Players",
  "Records",
  "Gallery",
];

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Cyder Cup home">
        <span className="brand-mark">CC</span>

        <span className="brand-copy">
          <strong>Cyder Cup</strong>
          <small>Est. 2019</small>
        </span>
      </a>

      <nav className="primary-navigation" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </nav>

      <button className="header-action" type="button">
        2026 Event
      </button>
    </header>
  );
}

export default Header;