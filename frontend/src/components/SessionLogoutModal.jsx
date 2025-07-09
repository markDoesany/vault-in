import React from 'react';

const SessionLogoutModal = ({ showLogoutModal, logoutCountdown }) => {
  if (!showLogoutModal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-secondary border border-gold dark:border-gold rounded-xl shadow-confident px-8 py-6 flex flex-col items-center max-w-xs w-full">
        <span className="text-3xl mb-2 text-gold">⏰</span>
        <h3 className="text-lg font-bold text-primary dark:text-gold mb-2 text-center">Session Expired</h3>
        <p className="text-sm text-gray-700 dark:text-gold mb-4 text-center">
          You will be logged out in <span className="font-bold text-gold text-lg">{logoutCountdown}</span> second{logoutCountdown !== 1 && 's'}.
        </p>
      </div>
    </div>
  );
};

export default SessionLogoutModal;