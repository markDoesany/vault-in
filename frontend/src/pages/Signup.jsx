import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignup = async (formData) => {
    setError('');
    try {
      const response = await signupUser(formData);
      if (!response.success) {
        setError(response.message || 'Signup failed. Please try again.');
      }
    } catch (apiError) {
      console.error('Signup page error:', apiError);
      throw apiError;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground font-poppins p-4">
      <AuthForm type="signup" onSubmit={handleSignup} />
      {error && <p className="mt-4 text-sm text-destructive dark:text-dark-destructive">{error}</p>}
      <p className="text-center mt-4 text-sm text-muted-foreground dark:text-dark-muted-foreground font-poppins">
        Already have an account?{' '}
        <Link to="/login" className="text-primary dark:text-dark-primary hover:underline font-semibold transition-colors">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
