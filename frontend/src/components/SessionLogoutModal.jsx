import React from 'react';

const SessionLogoutModal = ({ showLogoutModal, logoutCountdown }) => {
  if (!showLogoutModal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-70 p-4">
      <div className="bg-card dark:bg-dark-card text-card-foreground dark:text-dark-card-foreground border border-border dark:border-dark-border rounded-xl shadow-xl px-8 py-6 flex flex-col items-center max-w-xs w-full">
        <span className="text-3xl mb-2 text-primary dark:text-dark-primary">⏰</span>
        <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2 text-center">Session Expired</h3>
        <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground mb-4 text-center">
          You will be logged out in <span className="font-bold text-primary dark:text-dark-primary text-lg">{logoutCountdown}</span> second{logoutCountdown !== 1 && 's'}.
        </p>
      </div>
    </div>
  );
};

export default SessionLogoutModal;