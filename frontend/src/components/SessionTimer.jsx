import React from 'react';

const SessionTimer = ({ sessionTimeLeft }) => (
  <div className="fixed top-4 right-4 z-50 bg-background/80 dark:bg-dark-background/80 text-foreground dark:text-dark-foreground px-4 py-1 rounded-full font-semibold shadow-lg text-sm select-none pointer-events-none border border-border dark:border-dark-border">
    Session: {sessionTimeLeft}s
  </div>
);

export default SessionTimer;