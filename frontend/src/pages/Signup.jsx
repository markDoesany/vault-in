import React from 'react';
import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  const handleSignup = (data) => {
    // For now, just log the data
    console.log('Signup data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-primary font-poppins">
      <div className="w-full max-w-md bg-white dark:bg-primary rounded-xl shadow-confident border border-silver dark:border-gold p-8">
        <AuthForm type="signup" onSubmit={handleSignup} />
      </div>
      <p className="text-center mt-4 text-sm text-primary dark:text-gold font-poppins">
        Already have an account?{' '}
        <Link to="/login" className="text-gold dark:text-gold hover:text-silver dark:hover:text-silver font-semibold transition-colors">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
