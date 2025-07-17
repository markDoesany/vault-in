import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const { login: authLogin } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setError('');
    try {
      const response = await loginUser(formData);
      if (response.success && response.user && response.token) {
        authLogin(response.user, response.token);
      } else {
        throw new Error(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred');
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground dark:text-dark-foreground">
          Welcome Back
        </h1>
        
        <div className="bg-card dark:bg-dark-card rounded-xl shadow-lg p-8">
          <AuthForm 
            type="login" 
            onSubmit={handleLogin} 
            error={error}
          />
          
          <p className="text-center mt-6 text-sm text-muted-foreground dark:text-dark-muted-foreground">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-primary dark:text-dark-primary hover:underline font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
