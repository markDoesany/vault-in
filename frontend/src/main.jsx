import React, { StrictMode } from 'react'; // Imported React for JSX
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Import AuthProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* Router needs to be outside AuthProvider if AuthProvider uses useNavigate */}
      <ThemeProvider>
        <AuthProvider> {/* AuthProvider wraps App */}
          <App />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </StrictMode>,
);
