import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PasswordRequirement = ({ meets, label }) => (
  <li className={`flex items-center text-sm ${meets ? 'text-green-500' : 'text-red-500'}`}>
    {meets ? <FaCheckCircle className="mr-2" /> : <FaTimesCircle className="mr-2" />}
    {label}
  </li>
);

const ChangeMasterPasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const passwordChecks = [
    { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
    { label: 'At least one uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
    { label: 'At least one lowercase letter', test: (pw) => /[a-z]/.test(pw) },
    { label: 'At least one number', test: (pw) => /[0-9]/.test(pw) },
    { label: 'At least one special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
  ];

  const handleSave = () => {
    setError('');
    if (!oldPassword) {
      setError('Old password is required.');
      return;
    }
    if (!newPassword) {
      setError('New password is required.');
      return;
    }
    const newPasswordValid = passwordChecks.every(check => check.test(newPassword));
    if (!newPasswordValid) {
      setError('New password does not meet all requirements.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    // Simulate password change
    console.log('Master password change attempt:', { oldPassword, newPassword });
    alert('Master password change functionality is not yet implemented.'); // Placeholder
    onClose(); // Close modal on successful (simulated) save
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div
        className="relative bg-white dark:bg-secondary border border-gold dark:border-gold rounded-2xl shadow-confident p-6 sm:p-8 w-[95vw] max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-xl text-gray-400 hover:text-gold dark:hover:text-gold focus:outline-none"
          onClick={onClose}
          type="button"
          aria-label="Close change master password modal"
        >
          <FaTimesCircle />
        </button>
        <h2 className="text-xl font-bold text-primary dark:text-gold mb-6 text-center">Change Master Password</h2>

        {error && <p className="text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-md text-sm mb-4">{error}</p>}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4">
            {/* Old Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-primary dark:text-gray-300 mb-1" htmlFor="oldPassword">
                Old Password
              </label>
              <input
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-gold focus:border-gold dark:bg-primary dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gold dark:hover:text-gold"
                aria-label={showOldPassword ? 'Hide old password' : 'Show old password'}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-primary dark:text-gray-300 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-gold focus:border-gold dark:bg-primary dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gold dark:hover:text-gold"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Requirements */}
            {newPassword.length > 0 && (
              <ul className="mt-2 space-y-1 pl-1">
                {passwordChecks.map((check) => (
                  <PasswordRequirement
                    key={check.label}
                    meets={check.test(newPassword)}
                    label={check.label}
                  />
                ))}
              </ul>
            )}

            {/* Confirm New Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-primary dark:text-gray-300 mb-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-gold focus:border-gold dark:bg-primary dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gold dark:hover:text-gold"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gold hover:bg-yellow-600 dark:hover:bg-yellow-500 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeMasterPasswordModal;
