import React from 'react';
import Navbar from '../component/Navbar';
import '../styles/Navbar.css';

function NavbarPage() {
    return (
        <div className="navbar-page">
            <Navbar />
            <div className="content">
                <h1>Welcome to Our Website</h1>
                <p>This is a page with the navigation bar</p>
            </div>
        </div>
    );
}

export default NavbarPage; 