import React from 'react';
import { Navbar } from 'react-bootstrap';

const NavBar: React.FC = () => {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Book Wishlist</Navbar.Brand>
        </Navbar>
    );
};

export default NavBar;