import React from 'react';
import { FaUserCircle, FaTimes, FaMoon, FaSun, FaKey } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const ProfileSection = ({ profileOpen, setProfileOpen, openChangeMasterPasswordModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const displayUser = user || { username: 'Guest' };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleChangePassword = () => {
    openChangeMasterPasswordModal();
    setProfileOpen(false);
  };

  return (
    <>
      <button
        className="fixed top-6 right-6 z-40 bg-card dark:bg-dark-card text-primary dark:text-dark-primary rounded-full shadow-lg p-3 text-2xl border border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted transition-colors"
        onClick={() => setProfileOpen(true)}
        aria-label="Open profile"
        type="button"
      >
        <FaUserCircle />
      </button>

      {profileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-70"
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
            <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-1">
              {displayUser.username}
            </h2>
            
            {user?.email && (
              <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mb-4">
                {user.email}
              </p>
            )}
            {!user && <div className="mb-4" />}

            <button
              className="w-full mt-2 px-4 py-2 text-sm flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              onClick={handleChangePassword}
              type="button"
            >
              <FaKey className="mr-2" /> Change Master Password
            </button>

            <button
              className="w-full mt-3 px-4 py-2 text-sm flex items-center justify-center rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              onClick={handleThemeToggle}
              type="button"
            >
              {theme === 'light' ? (
                <FaMoon className="mr-2" />
              ) : (
                <FaSun className="mr-2" />
              )}
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>

            <button
              className="w-full mt-3 px-4 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
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
};


export default ProfileSection;