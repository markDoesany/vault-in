import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';

const AuthForm = ({ type, onSubmit }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.password) {
      setError('Password is required');
      return;
    }
    if (type === 'signup' && !form.username) {
      setError('Username is required');
      return;
    }
    if (type === 'signup' && !form.email) {
      setError('Email is required');
      return;
    }
    if (type === 'login' && !form.username) {
      setError('Username is required');
      return;
    }
    setError('');
    if (type === 'signup') {
      setShowSuccessModal(true);
    } else {
      setShowOtpModal(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  const handleForgotPassword = async (newPassword) => {
    // In a real app, this would make an API call to reset the password
    // and clear the vault data on the server side
    console.log('Resetting password and clearing vault data...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear local storage or any client-side vault data
    localStorage.removeItem('vaultData');
    
    // In a real app, you would redirect to login or automatically log them in
    // For now, we'll just close the modal and show a success message
    setShowForgotPasswordModal(false);
    // alert('Password has been reset successfully. Please log in with your new password.'); // Modal handles this now
    
    // Clear the form
    setForm({
      username: '',
      email: '',
      password: '',
    });
  };

  const handleOtpChange = (e) => setOtp(e.target.value);
  const handleOtpVerify = () => {
    setShowOtpModal(false);
    // Simulate successful OTP verification and navigate to dashboard
    navigate('/dashboard');
    // If you want to still call onSubmit, you can do so here as well
    // onSubmit({ ...form, otp });
  };

  // Password requirements checkers
  const passwordChecks = [
    {
      label: 'At least 8 characters',
      test: (pw) => pw.length >= 8,
    },
    {
      label: 'At least one uppercase letter',
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: 'At least one lowercase letter',
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      label: 'At least one number',
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      label: 'At least one special character',
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
  ];

  return (
    <form
      className="w-full max-w-sm mx-auto bg-white dark:bg-primary rounded-xl p-8 flex flex-col gap-4 dark:border-gold shadow-confident"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gold mb-2 text-center font-poppins">
        {type === 'signup' ? 'Create Account' : 'Sign In'}
      </h2>
      {/* Username input for both login and signup */}
      <input
        className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-primary text-primary dark:text-gold font-poppins"
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        autoFocus
      />
      {/* Email input only for signup */}
      {type === 'signup' && (
        <div className="relative">
          <input
            className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-primary text-primary dark:text-gold font-poppins w-full"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            autoFocus={type !== 'signup'}
            onFocus={() => setShowEmailTooltip(true)}
            onBlur={() => setShowEmailTooltip(false)}
            onMouseEnter={() => setShowEmailTooltip(true)}
            onMouseLeave={() => setShowEmailTooltip(false)}
            aria-describedby="email-otp-tooltip"
          />
          {showEmailTooltip && (
            <div
              id="email-otp-tooltip"
              className="absolute left-0 mt-2 w-72 bg-secondary text-text-primary text-xs rounded-lg shadow-md px-4 py-3 z-10 border border-border animate-fade-in"
              role="tooltip"
            >
              Whenever you log in, a one-time passcode (OTP) will be sent to this email address for verification.
            </div>
          )}
        </div>
      )}
      {/* Password input with requirements tooltip (signup only) */}
      {type === 'signup' ? (
        <div className="relative">
          <input
            className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-primary text-primary dark:text-gold font-poppins w-full"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onFocus={() => setShowPasswordTooltip(true)}
            onBlur={() => setShowPasswordTooltip(false)}
            onMouseEnter={() => setShowPasswordTooltip(true)}
            onMouseLeave={() => setShowPasswordTooltip(false)}
            aria-describedby="password-req-tooltip"
          />
          {showPasswordTooltip && (
            <div
              id="password-req-tooltip"
              className="absolute left-0 mt-2 w-80 bg-secondary text-text-primary text-xs rounded-lg shadow-md px-4 py-3 z-10 border border-border animate-fade-in"
              role="tooltip"
            >
              <div className="mb-2 text-text-primary font-semibold">Password must contain:</div>
              <ul className="space-y-1">
                {passwordChecks.map((req, idx) => {
                  const passed = req.test(form.password);
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      <span className={passed ? 'text-success' : 'text-error'}>
                        {passed ? '✔️' : '❌'}
                      </span>
                      <span className={passed ? 'text-text-primary' : 'text-text-secondary'}>{req.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <input
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-primary text-primary dark:text-gold font-poppins"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
      )}
      {error && <div className="text-red-600 bg-red-50 dark:bg-secondary dark:text-gold rounded px-3 py-2 text-sm text-center font-poppins">{error}</div>}
      <button
        className="bg-blue-600 dark:bg-gold hover:bg-blue-700 dark:hover:bg-primary text-white dark:text-primary rounded py-2 font-semibold mt-2 transition-colors font-poppins dark:hover:text-gold w-full"
        type="submit"
      >
        {type === 'signup' ? 'Sign Up' : 'Login'}
      </button>
      
      {type === 'login' && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowForgotPasswordModal(true);
            }}
            className="text-sm text-blue-600 dark:text-gold hover:underline focus:outline-none"
          >
            Forgot Master Password?
          </button>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-primary rounded-xl shadow-confident border border-silver dark:border-gold p-8 max-w-sm w-full flex flex-col items-center">
            <svg className="w-12 h-12 text-gold mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" /></svg>
            <h3 className="text-xl font-bold mb-2 text-primary dark:text-gold text-center">Sign Up Successful</h3>
            <p className="mb-6 text-center text-gray-700 dark:text-gold">Your account has been created! You can now log in with your credentials.</p>
            <button
              onClick={handleModalClose}
              className="px-6 py-2 rounded-xl bg-gold dark:bg-gold text-primary font-bold shadow-confident border border-silver dark:border-gold hover:bg-silver dark:hover:bg-primary hover:text-gold dark:hover:text-gold transition-colors"
              autoFocus
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-primary rounded-xl shadow-confident border border-silver dark:border-gold p-8 max-w-sm w-full flex flex-col items-center">
            <svg className="w-12 h-12 text-gold mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" /></svg>
            <h3 className="text-xl font-bold mb-2 text-primary dark:text-gold text-center">Enter OTP</h3>
            <p className="mb-4 text-center text-gray-700 dark:text-gold">A one-time passcode (OTP) has been sent to your email. Please enter it below to continue.</p>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              className="mb-4 px-4 py-2 rounded border border-silver dark:border-gold bg-gray-50 dark:bg-primary text-primary dark:text-gold font-poppins w-full text-center focus:outline-none focus:border-gold dark:focus:border-gold"
              placeholder="Enter OTP"
              autoFocus
            />
            <button
              onClick={handleOtpVerify}
              className="px-6 py-2 rounded-xl bg-gold dark:bg-gold text-primary font-bold shadow-confident border border-silver dark:border-gold hover:bg-silver dark:hover:bg-primary hover:text-gold dark:hover:text-gold transition-colors"
            >
              Verify
            </button>
          </div>
        </div>
      )}
      
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onResetPassword={handleForgotPassword}
      />
    </form>
  );
};

export default AuthForm;
