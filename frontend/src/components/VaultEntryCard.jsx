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
    <div className="relative w-full"> {/* Removed aspect-square to allow content to define height */}
      {/* Timestamp as a tab above the card */}
      {formatLastUpdated && (
        <div className="absolute -top-4 right-2 flex items-center text-xs text-gray-500 dark:text-tn-comment bg-white dark:bg-tn-card px-2 py-0.5 rounded-t border-l border-r border-t border-gray-300 dark:border-tn-border z-10 shadow-sm">
          <FaClock className="mr-1.5" size={10} />
          {formatLastUpdated}
        </div>
      )}
      
      <div className="bg-white dark:bg-tn-card rounded-lg shadow-md dark:shadow-lg border border-gray-200 dark:border-tn-border p-5 flex flex-col h-full transition-all duration-200 ease-in-out hover:shadow-xl dark:hover:border-tn-blue">
        <div className="flex flex-col flex-1 mb-4"> {/* Added mb-4 for spacing before buttons */}
          <div className="flex flex-col gap-1"> {/* Reduced gap for tighter heading */}
            <span className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-tn-blue">{entry.platform}</span>
            <span className="text-gray-600 dark:text-tn-fg font-mono text-sm">{entry.username}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <input
              type={showPassword ? 'text' : 'password'}
              value={entry.password}
              readOnly
              className="flex-grow px-3 py-1.5 rounded border border-gray-300 dark:border-tn-border bg-gray-50 dark:bg-tn-bg text-gray-700 dark:text-tn-fg font-mono text-sm focus:outline-none focus:ring-1 focus:ring-tn-blue dark:focus:border-tn-blue"
            />
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-tn-comment focus:outline-none focus:ring-1 focus:ring-tn-blue"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <FaEyeSlash className="text-lg text-gray-600 dark:text-tn-cyan" />
              ) : (
                <FaEye className="text-lg text-gray-600 dark:text-tn-cyan" />
              )}
            </button>
            <button
              type="button"
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-tn-comment focus:outline-none focus:ring-1 focus:ring-tn-blue"
              onClick={handleCopy}
              aria-label="Copy password"
            >
              <FaRegClipboard className="text-lg text-gray-600 dark:text-tn-green" />
            </button>
          </div>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-tn-comment text-xs text-gray-700 dark:text-tn-fg font-medium border border-gray-200 dark:border-tn-border">{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2.5 mt-auto"> {/* mt-auto to push buttons to bottom if card height varies */}
          <button
            type="button"
            className="px-3.5 py-1.5 text-sm rounded font-medium bg-tn-blue hover:bg-opacity-80 text-tn-bg dark:bg-tn-blue dark:hover:bg-opacity-90 dark:text-tn-bg focus:outline-none focus:ring-2 focus:ring-tn-blue focus:ring-opacity-50 flex items-center shadow-sm transition-colors"
            onClick={() => onEdit && onEdit(entry)}
            aria-label="Edit entry"
          >
            <FaEdit className="text-sm mr-1.5" /> Edit
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 text-sm rounded font-medium bg-tn-red hover:bg-opacity-80 text-tn-bg dark:bg-tn-red dark:hover:bg-opacity-90 dark:text-tn-bg focus:outline-none focus:ring-2 focus:ring-tn-red focus:ring-opacity-50 flex items-center shadow-sm transition-colors"
            onClick={() => onDelete && onDelete(entry)}
            aria-label="Delete entry"
          >
            <FaTrash className="text-sm mr-1.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultEntryCard;
