import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom'; // useNavigate is no longer needed here as AuthContext handles navigation
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const Login = () => {
  // const navigate = useNavigate(); // No longer needed here
  const { login: authLogin } = useAuth(); // Get login function from AuthContext
  const [error, setError] = useState(''); // Page-level error, AuthForm handles its own

  const handleLogin = async (formData) => {
    setError('');
    try {
      const response = await loginUser(formData); // Call the API service directly
      if (response.success && response.user && response.token) {
        authLogin(response.user, response.token); // Use AuthContext to set user and token, and navigate
        // Navigation to '/dashboard' is handled by authLogin inside AuthContext
      } else {
        // This path might not be hit if api.js always rejects on failure
        throw new Error(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (apiError) {
      console.error('Login page error:', apiError);
      // setError(apiError.message || 'An unexpected error occurred during login.'); // Set page-level error if needed
      throw apiError; // Re-throw for AuthForm to display the error
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground font-poppins p-4">
      <AuthForm type="login" onSubmit={handleLogin} />
      {error && <p className="mt-4 text-sm text-destructive dark:text-dark-destructive">{error}</p>}
      <p className="text-center mt-4 text-sm text-muted-foreground dark:text-dark-muted-foreground font-poppins">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-primary dark:text-dark-primary hover:underline font-semibold transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
