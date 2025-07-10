import React, { useState } from 'react'; // Added useState
import AuthForm from '../components/AuthForm';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { signupUser } from '../services/api'; // Import the API service

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(''); // To display page-level errors if AuthForm doesn't cover it
  // const [showSuccessMessage, setShowSuccessMessage] = useState(false); // AuthForm now handles its own success modal

  const handleSignup = async (formData) => {
    setError('');
    try {
      const response = await signupUser(formData);
      if (response.success) {
        // AuthForm will show its own success modal which then navigates to /login.
        // If we wanted to show a message on *this* page before AuthForm's modal takes over:
        // setShowSuccessMessage(true);
        // setTimeout(() => {
        //   setShowSuccessMessage(false);
        //   // AuthForm's success modal should handle the navigation to login.
        // }, 3000); // Show message for 3 seconds
      } else {
        // This case should ideally be caught by the reject in api.js if it's an error
        setError(response.message || 'Signup failed. Please try again.');
      }
    } catch (apiError) {
      // AuthForm will display this error.
      console.error('Signup page error:', apiError);
      // setError(apiError.message || 'An unexpected error occurred during signup.');
      throw apiError; // Re-throw to let AuthForm handle it
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground font-poppins p-4">
      <AuthForm type="signup" onSubmit={handleSignup} />
      {/* {showSuccessMessage && <p className="mt-4 text-sm text-tn-green">Signup successful! Redirecting to login...</p>} */}
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
