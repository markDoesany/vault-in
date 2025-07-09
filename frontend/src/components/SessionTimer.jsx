import React from 'react';

const SessionTimer = ({ sessionTimeLeft }) => (
  <div className="fixed top-4 right-4 z-50 bg-silver/80 dark:bg-gold/80 text-primary dark:text-gold px-4 py-1 rounded-full font-semibold shadow-confident text-sm select-none pointer-events-none">
    Session: {sessionTimeLeft}s
  </div>
);

export default SessionTimer;