import { NavLink } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: 'Home' },
  { to: '/find', label: 'Find Boarding' },
  { to: '/add', label: 'Add Boarding' },
];

function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-content" aria-label="Main navigation">
        <NavLink className="brand" to="/">BoardMe LK</NavLink>
        <div className="nav-links">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={item.to === '/'}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
