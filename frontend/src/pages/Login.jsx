import React from 'react';
import AuthForm from '../components/AuthForm';
import { Link } from 'react-router-dom'; // Removed useNavigate

const Login = () => {
  // const navigate = useNavigate(); // Removed unused variable
  const handleLogin = (data) => {
    console.log('Login data:', data);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground font-poppins p-4">
      {/* The AuthForm component itself is already themed. We just need to ensure the container and link are themed. */}
      {/* The AuthForm already has its own card-like styling, so we don't need to wrap it in another card here. */}
      <AuthForm type="login" onSubmit={handleLogin} />
      <p className="text-center mt-4 text-sm text-muted-foreground dark:text-dark-muted-foreground font-poppins">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-primary dark:text-dark-primary hover:underline font-semibold transition-colors">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
