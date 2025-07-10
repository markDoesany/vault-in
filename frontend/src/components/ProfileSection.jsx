import React from 'react';
import { FaUserCircle, FaTimes, FaMoon, FaSun, FaKey } from 'react-icons/fa'; // Added FaKey for Change Master Password
// useNavigate is no longer directly needed here for logout if AuthContext handles it.
// However, it might still be used if other navigation actions were present.
// For this refactor, let's assume AuthContext handles logout navigation.
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

export default function ProfileSection({
  profileOpen,
  setProfileOpen,
  openChangeMasterPasswordModal,
}) {
  // const navigate = useNavigate(); // Potentially remove if not used elsewhere
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth(); // Get user and logout from AuthContext

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    // Navigation to login is handled by AuthContext's logout function
    setProfileOpen(false); // Close the profile modal/dropdown
  };

  const displayUser = user || { username: 'Guest' }; // Fallback if user is null

  return (
    <>
      {/* Profile Button: Adjusted to fixed top right for consistency with previous versions if that was intended */}
      {/* Using existing FAB style from current file content */}
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
            <h2 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-1">
              {displayUser.username}
            </h2>
            {user && user.email && (
              <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mb-4">
                {user.email}
              </p>
            )}
            {!user && <div className="mb-4"></div>}


            <button
              className="btn btn-secondary w-full mt-2 text-sm flex items-center justify-center"
              onClick={() => {
                openChangeMasterPasswordModal();
                setProfileOpen(false);
              }}
              type="button"
            >
              <FaKey className="mr-2" /> Change Master Password
            </button>

            <button
              className="btn btn-secondary w-full mt-3 text-sm flex items-center justify-center"
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