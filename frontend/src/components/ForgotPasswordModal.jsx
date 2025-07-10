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

  const inputBaseClasses = "border rounded px-4 py-2 focus:outline-none font-poppins w-full";
  const themedInputClasses = `${inputBaseClasses} border-border dark:border-dark-border bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring`;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground dark:bg-dark-card dark:text-dark-card-foreground border border-border dark:border-dark-border shadow-xl rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => {
            onClose();
            setResetStatus(null); // Reset status when closing manually
            setFormError('');
            setPassword('');
            setConfirmPassword('');
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground"
          disabled={isResetting && resetStatus !== 'success'} // Disable close if processing, unless it's success
        >
          <FaTimes size={20} />
        </button>
        
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-destructive dark:text-dark-destructive mr-2" size={20} />
          <h3 className="text-lg font-semibold text-foreground dark:text-dark-foreground">Reset Master Password</h3>
        </div>
        
        <div className="bg-destructive/10 border-l-4 border-destructive dark:border-dark-destructive p-4 mb-4 rounded">
          <p className="text-destructive dark:text-dark-destructive text-sm">
            <strong>Warning:</strong> Resetting your master password will permanently delete all your vault data. 
            This action cannot be undone.
          </p>
        </div>
        
        {resetStatus === 'success' && (
          <div className="bg-tn-green/10 border-l-4 border-tn-green p-4 mb-4 rounded flex items-center">
            <FaCheck className="text-tn-green mr-3 flex-shrink-0" size={20} />
            <p className="text-tn-green text-sm font-semibold">{resetMessage}</p>
          </div>
        )}
        {resetStatus === 'error' && !formError && (
          <div className="bg-destructive/10 border-l-4 border-destructive dark:border-dark-destructive p-4 mb-4 rounded flex items-center">
            <FaTimes className="text-destructive dark:text-dark-destructive mr-3 flex-shrink-0" size={20} />
            <p className="text-destructive dark:text-dark-destructive text-sm font-semibold">{resetMessage}</p>
          </div>
        )}
        
        {formError && !resetStatus && (
          <div className="bg-destructive/10 border-l-4 border-destructive dark:border-dark-destructive p-4 mb-4 rounded">
            <p className="text-destructive dark:text-dark-destructive text-sm">{formError}</p>
          </div>
        )}

        {resetStatus !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="form-label text-foreground dark:text-dark-foreground">
                New Master Password
              </label>
              <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={themedInputClasses}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
              </div>
              
            {password && !allRequirementsMet && (
              <div className="mt-2 text-xs">
                <p className="form-label text-xs mb-1 text-foreground dark:text-dark-foreground">Password must contain:</p>
                <ul className="space-y-1">
                  {passwordChecks.map((check, index) => {
                    const isMet = check.test(password);
                    return (
                      <li key={index} className={`flex items-center ${isMet ? 'text-tn-green' : 'text-destructive dark:text-dark-destructive'}`}>
                        {isMet ? (
                          <FaCheck className="mr-1.5 flex-shrink-0 text-tn-green" size={12} />
                        ) : (
                          <FaTimes className="mr-1.5 flex-shrink-0 text-destructive dark:text-dark-destructive" size={12} />
                        )}
                        <span className="text-muted-foreground dark:text-dark-muted-foreground">{check.label}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            </div>
          
          <div>
            <label htmlFor="confirmPassword" className="form-label text-foreground dark:text-dark-foreground">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={themedInputClasses}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary"
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
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResetting || !password || !confirmPassword || !allRequirementsMet}
              className="btn btn-destructive" // Use the semantic destructive button style
            >
              {isResetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
        )}
        {resetStatus === 'success' && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onClose();
                setResetStatus(null);
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
