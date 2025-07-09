import React, { useState, useMemo } from 'react';
import { FaEye, FaEyeSlash, FaRegClipboard, FaEdit, FaTrash, FaClock } from 'react-icons/fa';

const VaultEntryCard = ({ entry, onCopy, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.password);
    if (onCopy) onCopy(entry);
  };

  const formatLastUpdated = useMemo(() => {
    if (!entry.updatedAt) return null;
    
    const updatedDate = new Date(entry.updatedAt);
    const now = new Date();
    const diffInDays = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Updated today';
    if (diffInDays === 1) return 'Updated yesterday';
    if (diffInDays < 7) return `Updated ${diffInDays} days ago`;
    
    return `Updated on ${updatedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })}`;
  }, [entry.updatedAt]);

  return (
    <div className="relative">
      {/* Timestamp as a tab above the card */}
      {formatLastUpdated && (
        <div className="absolute -top-5 right-2 flex items-center text-xs text-gray-500 dark:text-gray-300 bg-white dark:bg-secondary px-2 py-0.5 rounded-t border-l border-r border-t border-silver dark:border-gold z-10">
          <FaClock className="mr-1" size={10} />
          {formatLastUpdated}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-secondary rounded-xl shadow-confident border border-silver dark:border-gold p-4 gap-3 md:gap-0">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1">
        <span className="font-bold text-lg text-primary dark:text-gold">{entry.platform}</span>
        <span className="text-gray-700 dark:text-gold font-mono">{entry.username}</span>
        <div className="flex items-center gap-2">
          <input
            type={showPassword ? 'text' : 'password'}
            value={entry.password}
            readOnly
            className="w-32 px-2 py-1 rounded border border-silver dark:border-gold bg-gray-50 dark:bg-primary text-primary dark:text-gold font-mono focus:outline-none"
          />
          <button
            type="button"
            className="p-1 ml-2 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FaEyeSlash className="text-lg text-gold dark:text-gold" />
            ) : (
              <FaEye className="text-lg text-gold dark:text-gold" />
            )}
          </button>
          <button
            type="button"
            className="p-1 ml-2 focus:outline-none"
            onClick={handleCopy}
            aria-label="Copy password"
          >
            <FaRegClipboard className="text-lg text-gold dark:text-gold" />
          </button>
        </div>
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex gap-1 ml-2">
            {entry.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-silver dark:bg-primary text-xs text-primary dark:text-gold font-semibold border border-gold dark:border-gold">{tag}</span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-2">
          <button
            type="button"
            className="p-1 ml-1 focus:outline-none"
            onClick={() => onEdit && onEdit(entry)}
            aria-label="Edit entry"
          >
            <FaEdit className="text-base text-silver dark:text-gold" />
          </button>
          <button
            type="button"
            className="p-1 ml-1 focus:outline-none"
            onClick={() => onDelete && onDelete(entry)}
            aria-label="Delete entry"
          >
            <FaTrash className="text-base text-red-500 dark:text-red-400" />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default VaultEntryCard;
