import React from 'react';
import { FaUserCircle, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

export default function ProfileSection({
  profileOpen,
  setProfileOpen,
  openChangeMasterPasswordModal,
}) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme(); // Get theme and toggle function

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        className="fixed top-6 left-6 z-40 bg-white dark:bg-tn-card text-tn-blue dark:text-tn-blue rounded-full shadow-lg p-3 text-2xl border border-gray-200 dark:border-tn-border hover:bg-gray-100 dark:hover:bg-tn-comment transition-colors"
        onClick={() => setProfileOpen(true)}
        aria-label="Open profile"
        type="button"
      >
        <FaUserCircle />
      </button>
      {/* Profile Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70"
          onClick={() => setProfileOpen(false)}
        >
          <div
            className="relative bg-white dark:bg-tn-card border border-gray-200 dark:border-tn-border rounded-lg shadow-xl p-6 w-[90vw] max-w-xs flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-xl text-gray-400 dark:text-tn-comment hover:text-gray-600 dark:hover:text-tn-fg focus:outline-none"
              onClick={() => setProfileOpen(false)}
              type="button"
              aria-label="Close profile modal"
            >
              <FaTimes />
            </button>
            <FaUserCircle className="text-5xl text-tn-blue mb-3" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-tn-fg mb-4">Account</h2>

            <button
              className="w-full mt-2 px-4 py-2.5 rounded-md bg-gray-100 dark:bg-tn-comment text-gray-700 dark:text-tn-fg font-medium hover:bg-gray-200 dark:hover:bg-tn-border transition-colors text-sm"
              onClick={() => {
                openChangeMasterPasswordModal();
                setProfileOpen(false);
              }}
              type="button"
            >
              Change Master Password
            </button>

            <button
              className="w-full mt-3 px-4 py-2.5 rounded-md bg-gray-100 dark:bg-tn-comment text-gray-700 dark:text-tn-fg font-medium hover:bg-gray-200 dark:hover:bg-tn-border transition-colors text-sm flex items-center justify-center"
              onClick={() => {
                toggleTheme();
                // setProfileOpen(false); // Optionally close modal on theme change
              }}
              type="button"
            >
              {theme === 'light' ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>

            <button
              className="w-full mt-3 px-4 py-2.5 rounded-md bg-tn-red hover:bg-opacity-80 text-white font-medium shadow-sm transition-colors text-sm"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}