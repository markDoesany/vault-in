import React from 'react';
import { FaRegClipboard } from 'react-icons/fa';

const CopySuccessModal = ({ showCopyModal }) => {
  if (!showCopyModal) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 pointer-events-none">
      <div className="bg-white dark:bg-secondary border border-gold dark:border-gold rounded-xl shadow-confident px-6 py-4 flex flex-col items-center max-w-xs w-full pointer-events-auto">
        <FaRegClipboard className="text-3xl text-gold mb-2" />
        <span className="text-primary dark:text-gold font-bold text-lg mb-1">Copied!</span>
        <span className="text-sm text-gray-700 dark:text-gold">Password copied to clipboard</span>
      </div>
    </div>
  );
};

export default CopySuccessModal;