import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
    return (
        <Navbar bg="dark" variant="dark" className='navbar'>
            <Navbar.Brand href="#home">My Book List App</Navbar.Brand>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
            </ul>
        </Navbar>
    );
};

export default NavBar;