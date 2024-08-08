import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebTracker from './pages/WebTracker';
import WebDriver from './pages/WebDriver';
import WebAdmin from './pages/WebAdmin';
import Header from './components/Header';
import './index.css';

function App() {
    return (
        <Router>
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/" element={<WebTracker />} />
                    <Route path="/driver" element={<WebDriver />} />
                    <Route path="/admin" element={<WebAdmin />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
