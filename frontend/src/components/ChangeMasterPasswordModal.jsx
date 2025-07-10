import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa'; // Added FaTimes

const PasswordRequirement = ({ meets, label }) => (
  <li className={`flex items-center text-sm ${meets ? 'text-tn-green' : 'text-destructive dark:text-dark-destructive'}`}>
    {meets ? <FaCheckCircle className="mr-2 text-tn-green" /> : <FaTimesCircle className="mr-2 text-destructive dark:text-dark-destructive" />}
    <span className="text-foreground dark:text-dark-foreground">{label}</span>
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

  const inputClasses = "w-full px-4 py-2 border border-border dark:border-dark-border rounded-lg focus:ring-ring focus:border-ring dark:focus:ring-dark-ring dark:focus:border-dark-ring bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground";
  const labelClasses = "block text-sm font-medium text-foreground dark:text-dark-foreground mb-1";
  const eyeButtonClasses = "absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-muted-foreground dark:text-dark-muted-foreground hover:text-primary dark:hover:text-dark-primary";


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-70 p-4" onClick={onClose}>
      <div
        className="relative bg-card text-card-foreground dark:bg-dark-card dark:text-dark-card-foreground border border-border dark:border-dark-border rounded-2xl shadow-xl p-6 sm:p-8 w-[95vw] max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground focus:outline-none"
          onClick={onClose}
          type="button"
          aria-label="Close change master password modal"
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground mb-6 text-center">Change Master Password</h2>

        {error && <p className="text-destructive-foreground bg-destructive/20 dark:bg-dark-destructive/30 border border-destructive dark:border-dark-destructive p-3 rounded-md text-sm mb-4">{error}</p>}

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-4">
            {/* Old Password */}
            <div className="relative">
              <label className={labelClasses} htmlFor="oldPassword">
                Old Password
              </label>
              <input
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className={eyeButtonClasses}
                aria-label={showOldPassword ? 'Hide old password' : 'Show old password'}
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className={labelClasses} htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={eyeButtonClasses}
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
              <label className={labelClasses} htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={eyeButtonClasses}
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
              className="px-4 py-2 text-sm font-medium text-foreground bg-muted dark:text-dark-foreground dark:bg-dark-muted hover:bg-muted/80 dark:hover:bg-dark-muted/80 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary dark:text-dark-primary-foreground dark:bg-dark-primary hover:bg-primary/90 dark:hover:bg-dark-primary/90 rounded-lg transition-colors"
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
