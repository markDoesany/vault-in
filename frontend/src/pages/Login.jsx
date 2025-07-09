import React from 'react';
import AuthForm from '../components/AuthForm';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const handleLogin = (data) => {
    console.log('Login data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-primary font-poppins">
      <div className="w-full max-w-md bg-white dark:bg-primary rounded-xl shadow-confident border border-silver dark:border-gold p-8">
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
      <p className="text-center mt-4 text-sm text-primary dark:text-gold font-poppins">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-gold dark:text-gold hover:text-silver dark:hover:text-silver font-semibold transition-colors">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
