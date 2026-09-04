import { useState } from 'react';
import { NavLink } from 'react-router-dom';
const items = [['/', 'Home'], ['/find', 'Find Boarding'], ['/add', 'Add Boarding']];
function Navbar() { const [open, setOpen] = useState(false); return <header className="navbar"><nav className="navbar-content content-width"><NavLink className="brand" to="/" onClick={() => setOpen(false)}>BoardMe LK</NavLink><button className="menu-toggle" type="button" aria-label="Toggle navigation menu" aria-expanded={open} onClick={() => setOpen(!open)}><span/><span/><span/></button><div className={open ? 'nav-links nav-links-open' : 'nav-links'}>{items.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>{label}</NavLink>)}</div></nav></header>; }
export default Navbar;
