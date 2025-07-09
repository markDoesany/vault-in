import React, { useState, useMemo } from 'react';
import { FaExclamationTriangle, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const ForgotPasswordModal = ({ isOpen, onClose, onResetPassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  
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
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!allRequirementsMet) {
      setError('Please ensure all password requirements are met');
      return;
    }
    
    setError('');
    setIsResetting(true);
    
    try {
      await onResetPassword(password);
      // The parent component will handle the navigation after successful reset
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          disabled={isResetting}
        >
          ✕
        </button>
        
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gold">Reset Master Password</h3>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700 dark:text-yellow-300 text-sm">
            <strong>Warning:</strong> Resetting your master password will permanently delete all your vault data. 
            This action cannot be undone.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Master Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gold focus:border-gold dark:bg-gray-700 dark:text-white"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {/* Password Requirements - Only show if not all requirements are met */}
            {!allRequirementsMet && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">Password must contain:</p>
                <ul className="space-y-1">
                  {passwordChecks.map((check, index) => {
                    const isMet = check.test(password);
                    return (
                      <li key={index} className={`flex items-center ${isMet ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {isMet ? (
                          <FaCheck className="mr-1.5 flex-shrink-0" size={10} />
                        ) : (
                          <FaTimes className="mr-1.5 flex-shrink-0" size={10} />
                        )}
                        {check.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-gold focus:border-gold dark:bg-gray-700 dark:text-white"
                required
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isResetting}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResetting || !password || !confirmPassword || !allRequirementsMet}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isResetting ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
