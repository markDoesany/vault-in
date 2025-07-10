import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'; // Removed BrowserRouter, Added Outlet
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuth } from './contexts/AuthContext'; // Import useAuth

// ProtectedRoute component
const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    // Optional: show a loading spinner or a blank page while checking auth state
    return <div>Loading authentication...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

// GuestRoute component (for login/signup pages, redirect if logged in)
const GuestRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  return !isLoggedIn ? <Outlet /> : <Navigate to="/dashboard" replace />;
};


function App() {
  return (
    <Routes>
      {/* Routes accessible only to guests (not logged in) */}
      <Route element={<GuestRoute />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes - only accessible when logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Fallback route - if logged in, go to dashboard, else to login */}
      <Route
        path="*"
        element={
          <Navigate
            to={localStorage.getItem('authToken') ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;
