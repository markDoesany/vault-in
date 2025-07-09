import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      {/* Theme toggle button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 md:top-4 md:left-4 top-2 left-2 z-50 px-3 py-1 md:px-4 md:py-2 rounded-xl shadow-confident font-bold bg-primary text-gold border border-silver hover:bg-secondary hover:text-white transition-colors text-sm md:text-base"
        aria-label="Toggle dark mode"
      >
        {theme === 'light' ? '🌙' : '☀️'}
        <span className="hidden md:inline"> {theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
