import React from 'react';
import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom';

const Signup = () => {
  const handleSignup = (data) => {
    // For now, just log the data
    console.log('Signup data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground font-poppins p-4">
      {/* The AuthForm component itself is already themed. We just need to ensure the container and link are themed. */}
      {/* The AuthForm already has its own card-like styling, so we don't need to wrap it in another card here. */}
      <AuthForm type="signup" onSubmit={handleSignup} />
      <p className="text-center mt-4 text-sm text-muted-foreground dark:text-dark-muted-foreground font-poppins">
        Already have an account?{' '}
        <Link to="/login" className="text-primary dark:text-dark-primary hover:underline font-semibold transition-colors">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
