import React, { useState, useEffect } from 'react';

const SESSION_DURATION = 30 * 60; // 30 minutes in seconds
const WARNING_THRESHOLD = 60; // Show warning when 1 minute left

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const SessionTimer = ({ onLogoutWarning, onLogout }) => {
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onLogout();
      return;
    }

    if (timeLeft <= WARNING_THRESHOLD && !warningShown) {
      onLogoutWarning();
      setWarningShown(true);
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onLogout, onLogoutWarning, warningShown]);

  // Reset timer on user activity
  useEffect(() => {
    const resetTimer = () => {
      setTimeLeft(SESSION_DURATION);
      setWarningShown(false);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (  
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-tn-card/90 dark:bg-tn-bg/90 text-tn-fg dark:text-tn-fg px-4 py-1.5 rounded-full font-medium text-sm select-none pointer-events-auto border border-tn-border/50 dark:border-tn-border/50 shadow-sm">
      <span className="hidden sm:inline">Session: </span>
      <span className={timeLeft <= WARNING_THRESHOLD ? 'text-tn-red font-semibold' : 'text-tn-fg'}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default SessionTimer;