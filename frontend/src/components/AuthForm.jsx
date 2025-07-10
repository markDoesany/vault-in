import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';

// Added onSubmit prop back
const AuthForm = ({ type, onSubmit }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const [showEmailTooltip, setShowEmailTooltip] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false); // This might be handled by parent or removed if API handles OTP directly
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [otp, setOtp] = useState(''); // OTP might be handled by parent or API service
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic client-side validation
    if (type === 'login' && !form.username) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }
    if (type === 'signup' && !form.username) {
      setError('Username is required');
      setIsLoading(false);
      return;
    }
    if (type === 'signup' && !form.email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }
    if (!form.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }
    if (type === 'signup') {
      // Password strength check for signup
      const passwordIsValid = passwordChecks.every(check => check.test(form.password));
      if (!passwordIsValid) {
        setError('Password does not meet requirements.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // onSubmit prop will be the actual API call function (loginUser or signupUser)
      await onSubmit(form);
      // Success handling (like navigation or showing success modal) will be managed by parent pages (Login.jsx, Signup.jsx)
      // For signup, the parent might show a success message and redirect to login.
      // For login, the parent might redirect to dashboard.
      // If signup here should show a success modal before parent navigates:
      if (type === 'signup') {
         setShowSuccessModal(true); // Or this could be handled by the parent page after API success
      }
      // OTP modal might be triggered here or by parent depending on API flow
      // For now, let's assume login success is handled by parent redirecting to dashboard.

    } catch (apiError) {
      setError(apiError.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => { // This is for the signup success modal
    setShowSuccessModal(false);
    navigate('/login'); // Navigate to login after signup success
  };

  const handleForgotPassword = async () => {
    // This function will likely call an API endpoint in the future.
    // For now, it's a placeholder as in the original code.
    console.log('Initiating forgot password process for:', form.email || form.username);
    // In a real app, this would make an API call to send a reset link or OTP.
    // For now, we'll just close the modal and show a success message/alert.
    setShowForgotPasswordModal(false);
    alert('If an account exists for this email, a password reset link will be sent.'); // Placeholder
    setForm(prev => ({ ...prev, password: '' })); // Clear password
  };

  // OTP handling might be revised based on actual API flow.
  // If API expects OTP after initial login/signup, this could be used.
  // For now, it's kept similar to original, but API service doesn't implement OTP flow yet.
  const handleOtpChange = (e) => setOtp(e.target.value);
  const handleOtpVerify = async () => {
    setIsLoading(true);
    setError('');
    try {
      // This would be another API call, e.g., verifyOtp(otp)
      console.log('Verifying OTP:', otp);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowOtpModal(false);
      navigate('/dashboard'); // Navigate on successful OTP verification
    } catch (otpError) {
      setError(otpError.message || 'Invalid OTP.');
    } finally {
      setIsLoading(false);
    }
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
      className="w-full max-w-sm mx-auto bg-card text-card-foreground dark:bg-dark-card dark:text-dark-card-foreground rounded-xl p-8 flex flex-col gap-4 border border-border dark:border-dark-border shadow-lg"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <h2 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-2 text-center font-poppins">
        {type === 'signup' ? 'Create Account' : 'Sign In'}
      </h2>
      {/* Username input for both login and signup */}
      <input
        className="border border-border dark:border-dark-border rounded px-4 py-2 focus:outline-none focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground font-poppins"
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
            className="border border-border dark:border-dark-border rounded px-4 py-2 focus:outline-none focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground font-poppins w-full"
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
              className="absolute left-0 mt-2 w-72 bg-popover text-popover-foreground dark:bg-dark-popover dark:text-dark-popover-foreground text-xs rounded-lg shadow-md px-4 py-3 z-10 border border-border dark:border-dark-border animate-fade-in"
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
            className="border border-border dark:border-dark-border rounded px-4 py-2 focus:outline-none focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground font-poppins w-full"
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
              className="absolute left-0 mt-2 w-80 bg-popover text-popover-foreground dark:bg-dark-popover dark:text-dark-popover-foreground text-xs rounded-lg shadow-md px-4 py-3 z-10 border border-border dark:border-dark-border animate-fade-in"
              role="tooltip"
            >
              <div className="mb-2 text-foreground dark:text-dark-foreground font-semibold">Password must contain:</div>
              <ul className="space-y-1">
                {passwordChecks.map((req, idx) => {
                  const passed = req.test(form.password);
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      <span className={passed ? 'text-tn-green' : 'text-destructive dark:text-dark-destructive'}>
                        {passed ? '✔️' : '❌'}
                      </span>
                      <span className={passed ? 'text-foreground dark:text-dark-foreground' : 'text-muted-foreground dark:text-dark-muted-foreground'}>{req.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <input
          className="border border-border dark:border-dark-border rounded px-4 py-2 focus:outline-none focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground font-poppins"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
      )}
      {error && <div className="text-destructive-foreground bg-destructive dark:bg-dark-destructive dark:text-dark-destructive-foreground rounded px-3 py-2 text-sm text-center font-poppins">{error}</div>}
      <button
        className="bg-primary dark:bg-dark-primary hover:bg-opacity-90 dark:hover:bg-opacity-90 text-primary-foreground dark:text-dark-primary-foreground rounded py-2 font-semibold mt-2 transition-colors font-poppins w-full"
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
            className="text-sm text-primary dark:text-dark-primary hover:underline focus:outline-none"
          >
            Forgot Master Password?
          </button>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card dark:bg-dark-card rounded-xl shadow-lg border border-border dark:border-dark-border p-8 max-w-sm w-full flex flex-col items-center">
            <svg className="w-12 h-12 text-tn-green mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" /></svg>
            <h3 className="text-xl font-bold mb-2 text-foreground dark:text-dark-foreground text-center">Sign Up Successful</h3>
            <p className="mb-6 text-center text-muted-foreground dark:text-dark-muted-foreground">Your account has been created! You can now log in with your credentials.</p>
            <button
              onClick={handleModalClose}
              className="px-6 py-2 rounded-xl bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground font-bold shadow-md border border-transparent hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
              autoFocus
            >
              Okay
            </button>
          </div>
        </div>
      )}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-card dark:bg-dark-card rounded-xl shadow-lg border border-border dark:border-dark-border p-8 max-w-sm w-full flex flex-col items-center">
            <svg className="w-12 h-12 text-primary dark:text-dark-primary mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" /></svg>
            <h3 className="text-xl font-bold mb-2 text-foreground dark:text-dark-foreground text-center">Enter OTP</h3>
            <p className="mb-4 text-center text-muted-foreground dark:text-dark-muted-foreground">A one-time passcode (OTP) has been sent to your email. Please enter it below to continue.</p>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              maxLength={6}
              className="mb-4 px-4 py-2 rounded border border-border dark:border-dark-border bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground font-poppins w-full text-center focus:outline-none focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring"
              placeholder="Enter OTP"
              autoFocus
            />
            <button
              onClick={handleOtpVerify}
              className="px-6 py-2 rounded-xl bg-primary dark:bg-dark-primary text-primary-foreground dark:text-dark-primary-foreground font-bold shadow-md border border-transparent hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-colors"
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
