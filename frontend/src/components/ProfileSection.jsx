import React from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function ProfileSection({ // Changed to export default function
  profileOpen,
  setProfileOpen,
  openChangeMasterPasswordModal, // Add prop to open the modal
}) {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    // Potentially clear session/token here in a real app
    navigate('/login');
  };

  return (
  <>
    {/* Floating Action Button (FAB) */}
    <button
      className="fixed top-6 left-6 z-40 bg-gold text-primary rounded-full shadow-confident p-4 text-3xl border-4 border-silver bg-white hover:bg-silver transition-colors"
      onClick={() => setProfileOpen(true)}
      aria-label="Open profile"
      type="button"
    >
      <FaUserCircle />
    </button>
    {/* Profile Modal */}
    {profileOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setProfileOpen(false)}>
        <div
          className="relative bg-white border border-gold rounded-2xl shadow-confident p-8 w-[95vw] max-w-sm flex flex-col items-center"
          onClick={e => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gold focus:outline-none"
            onClick={() => setProfileOpen(false)}
            type="button"
            aria-label="Close profile modal"
          >
            <FaTimes />
          </button>
          <FaUserCircle className="text-5xl text-gold mb-2" />
          <h2 className="text-xl font-bold text-primary mb-1">Account</h2>
          {/* Optionally display user info */}
          {/* {user && (
            <div className="text-center text-primary mb-4">
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs">{user.email}</div>
            </div>
          )} */}
          <button
            className="w-full mt-2 px-4 py-2 rounded-xl bg-silver text-primary font-bold shadow-confident border border-silver hover:bg-gold hover:text-gold transition-colors"
            onClick={() => {
              openChangeMasterPasswordModal();
              setProfileOpen(false); // Close profile section modal
            }}
            type="button"
          >
            Change Master Password
          </button>
          <button
            className="w-full mt-2 px-4 py-2 rounded-xl bg-red-500 text-white font-bold shadow-confident border border-red-500 hover:bg-red-600 transition-colors"
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
} // Added closing brace for the function component
// Removed redundant export default ProfileSection;