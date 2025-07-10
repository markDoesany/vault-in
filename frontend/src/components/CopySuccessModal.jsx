import React from 'react';
import { FaRegClipboard } from 'react-icons/fa';

const CopySuccessModal = ({ showCopyModal }) => {
  if (!showCopyModal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-70 pointer-events-none">
      <div className="bg-card dark:bg-dark-card text-card-foreground dark:text-dark-card-foreground border border-border dark:border-dark-border rounded-xl shadow-xl px-6 py-4 flex flex-col items-center max-w-xs w-full pointer-events-auto">
        <FaRegClipboard className="text-3xl text-tn-green mb-2" />
        <span className="text-foreground dark:text-dark-foreground font-bold text-lg mb-1">Copied!</span>
        <span className="text-sm text-muted-foreground dark:text-dark-muted-foreground">Password copied to clipboard</span>
      </div>
    </div>
  );
};

export default CopySuccessModal;