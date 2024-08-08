import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><Link to="/">Web Tracker</Link></li>
                <li><Link to="/driver">Web Driver</Link></li>
                <li><Link to="/admin">Web Admin</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;
