import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true); // To check initial auth status
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Here you might want to verify the token with the backend
          // For now, we assume if it exists, it's valid for the stubbed app
          console.log('AuthContext: User and token loaded from localStorage.');
        } catch (error) {
          console.error('AuthContext: Error parsing user data from localStorage', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
    setToken(authToken);
    console.log('AuthContext: User logged in, token and user data stored.');
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setToken(null);
    console.log('AuthContext: User logged out, token and user data removed.');
    navigate('/login'); // Redirect to login page after logout
  };

  // This function could be used to update user info if it changes
  const updateUser = (newUserData) => {
    localStorage.setItem('userData', JSON.stringify(newUserData));
    setUser(newUserData);
     console.log('AuthContext: User data updated.');
  };

  const value = {
    user,
    token,
    isLoading,
    isLoggedIn: !!token, // Derived state: true if token exists
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
