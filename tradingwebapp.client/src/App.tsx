import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import MainApp from './PageMain';
import Register from './PageRegister';
import Login from './PageLogin';
import Cookies from 'js-cookie';
import QuoteComponent from './PageQuote';
import BuyPage from './PageBuy';
import SellPage from './PageSell';
import TransactionPage from './PageHistory'; 
import Footer from './Footer';
const App: React.FC = () => {


    useEffect(() => {
        // Check if userID cookie exists
        const isLoggedIn = !!Cookies.get('userID');
        const currentPath = window.location.pathname;

        const loginPath = '/login';
        const registerPath = '/register';

        if (!isLoggedIn && currentPath !== loginPath && currentPath !== registerPath) {
            // If userID cookie doesn't exist and not on the login or register page, redirect to login page
            window.location.href = loginPath;
        }
    }, []);

    return (
        <Router>
            <div>
                <NavBar />
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<MainApp />} />
                    <Route path="/quote" element={<QuoteComponent />} />
                    <Route path="/buy" element={<BuyPage />} />
                    <Route path="/sell" element={<SellPage />} />
                    <Route path="/history" element={<TransactionPage />} />
                </Routes>
                <Footer /> 
            </div>
        </Router>
    );
};

export default App;
