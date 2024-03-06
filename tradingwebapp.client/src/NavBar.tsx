//NavBar.tsx
import React from 'react';
import Cookies from 'js-cookie'; 
import { logoutUser } from './api-user';
const NavBar: React.FC = () => {
    const isLoggedIn = !!Cookies.get('userID'); // Check if userID cookie exists
    const handleLogout = async () => {
        try {
            await logoutUser(); // Call logoutUser function to log out the user
            Cookies.remove('userID'); // Remove the userID cookie
            window.location.href = '/'; // Redirect the user to the main page
        } catch (error) {
            console.error('Logout failed:', error); 
        }
    };
    return (
        <nav className="bg-light border navbar navbar-expand-md navbar-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <span className="blue">C</span>
                    <span className="red">$</span>
                    <span className="yellow">5</span>
                    <span className="green">0</span>
                    <span className="red"> Finance</span>
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbar"
                    aria-controls="navbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbar">
                    <ul className="navbar-nav me-auto mt-2">
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/">
                                        Portfolio
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/quote">
                                        Quote
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/buy">
                                        Buy
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/sell">
                                        Sell
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/history">
                                        History
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto mt-2">
                        {isLoggedIn ? (
                            <li className="nav-item">
                                <a className="nav-link" href="/logout" onClick={handleLogout}>
                                    Log Out
                                </a>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/register">
                                        Register
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/login">
                                        Log In
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
