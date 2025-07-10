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
        className="fixed top-6 left-6 z-40 bg-card dark:bg-dark-card text-primary dark:text-dark-primary rounded-full shadow-lg p-3 text-2xl border border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted transition-colors"
        onClick={() => setProfileOpen(true)}
        aria-label="Open profile"
        type="button"
      >
        <FaUserCircle />
      </button>
      {/* Profile Modal */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-70" // Consistent backdrop
          onClick={() => setProfileOpen(false)}
        >
          <div
            className="relative bg-card text-card-foreground dark:bg-dark-card dark:text-dark-card-foreground border border-border dark:border-dark-border rounded-lg shadow-xl p-6 w-[90vw] max-w-xs flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground focus:outline-none"
              onClick={() => setProfileOpen(false)}
              type="button"
              aria-label="Close profile modal"
            >
              <FaTimes />
            </button>
            <FaUserCircle className="text-5xl text-primary dark:text-dark-primary mb-3" />
            <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-4">Account</h2>

            <button
              className="btn btn-secondary w-full mt-2 text-sm" // Using btn-secondary for a less prominent action
              onClick={() => {
                openChangeMasterPasswordModal();
                setProfileOpen(false);
              }}
              type="button"
            >
              Change Master Password
            </button>

            <button
              className="btn btn-secondary w-full mt-3 text-sm flex items-center justify-center" // Using btn-secondary
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
              className="btn btn-destructive w-full mt-3 text-sm" // Using btn-destructive for logout
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