import React, { useState, useMemo } from 'react';
import { FaExclamationTriangle, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const ForgotPasswordModal = ({ isOpen, onClose, onResetPassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState(''); // Renamed from error to avoid confusion
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState(null); // null, 'success', 'error'
  const [resetMessage, setResetMessage] = useState('');
  
  // Password requirements checkers - same as in AuthForm
  const passwordChecks = useMemo(() => [
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
  ], []);
  
  const allRequirementsMet = useMemo(() => 
    passwordChecks.every(check => check.test(password)),
    [password, passwordChecks]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResetStatus(null);
    setResetMessage('');
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (!allRequirementsMet) {
      setFormError('Please ensure all password requirements are met');
      return;
    }
    
    setFormError('');
    setIsResetting(true);
    
    try {
      await onResetPassword(password);
      setResetStatus('success');
      setResetMessage('Master password has been reset successfully!');
      // Clear form fields on success
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setResetStatus('error');
      setResetMessage(err.message || 'Failed to reset password. Please try again.');
      setFormError(err.message || 'Failed to reset password. Please try again.'); // Keep formError for inline display if needed
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border shadow-lg rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => {
            onClose();
            setResetStatus(null); // Reset status when closing manually
            setFormError('');
            setPassword('');
            setConfirmPassword('');
          }}
          className="absolute top-3 right-3 text-text-secondary hover:text-text-primary"
          disabled={isResetting && resetStatus !== 'success'} // Disable close if processing, unless it's success
        >
          <FaTimes size={20} />
        </button>
        
        <div className="flex items-center mb-4">
          {/* Using a theme-consistent icon */}
          <FaExclamationTriangle className="text-error mr-2" size={20} />
          <h3 className="text-lg font-semibold text-text-primary">Reset Master Password</h3>
        </div>
        
        {/* Warning Message - Adjusted styling */}
        <div className="bg-red-50 border-l-4 border-error p-4 mb-4 rounded">
          <p className="text-error text-sm">
            <strong>Warning:</strong> Resetting your master password will permanently delete all your vault data. 
            This action cannot be undone.
          </p>
        </div>
        
        {/* Overall Reset Status Message Area */}
        {resetStatus === 'success' && (
          <div className="bg-green-50 border-l-4 border-success p-4 mb-4 rounded flex items-center">
            <FaCheck className="text-success mr-3 flex-shrink-0" size={20} />
            <p className="text-success text-sm font-semibold">{resetMessage}</p>
          </div>
        )}
        {resetStatus === 'error' && !formError && ( // Show general error if not specific formError
          <div className="bg-red-50 border-l-4 border-error p-4 mb-4 rounded flex items-center">
            <FaTimes className="text-error mr-3 flex-shrink-0" size={20} />
            <p className="text-error text-sm font-semibold">{resetMessage}</p>
          </div>
        )}
        
        {/* Form Error (e.g. passwords don't match) */}
        {formError && !resetStatus && ( // Only show formError if no reset attempt status is active
          <div className="bg-red-50 border-l-4 border-error p-4 mb-4 rounded">
            <p className="text-error text-sm">{formError}</p>
          </div>
        )}

        {/* Hide form on success, otherwise show */}
        {resetStatus !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="form-label">
                New Master Password
              </label>
              <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full" // Tailwind class from index.css will apply
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              </div>
              
              {/* Password Requirements - Adjusted styling */}
            {password && !allRequirementsMet && ( // Show only if password has input and not all met
              <div className="mt-2 text-xs">
                <p className="form-label text-xs mb-1">Password must contain:</p>
                <ul className="space-y-1">
                  {passwordChecks.map((check, index) => {
                    const isMet = check.test(password);
                    return (
                      <li key={index} className={`flex items-center ${isMet ? 'text-success' : 'text-error'}`}>
                        {isMet ? (
                          <FaCheck className="mr-1.5 flex-shrink-0" size={12} />
                        ) : (
                          <FaTimes className="mr-1.5 flex-shrink-0" size={12} />
                        )}
                        <span className="text-text-secondary">{check.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full" // Tailwind class from index.css will apply
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text-primary"
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                setResetStatus(null);
                setFormError('');
                setPassword('');
                setConfirmPassword('');
              }}
              disabled={isResetting}
              className="btn btn-secondary" // Using new button styles
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResetting || !password || !confirmPassword || !allRequirementsMet}
              className="btn btn-primary bg-error hover:bg-red-700 text-background border-error hover:border-red-700" // Base .btn, but with error colors for emphasis
            >
              {isResetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
        )}
        {/* Show only close button on success */}
        {resetStatus === 'success' && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                setResetStatus(null); // Reset for next time
                setFormError('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
