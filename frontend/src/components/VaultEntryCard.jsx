import React, { useState, useMemo } from 'react';
import { 
  FaEye, 
  FaEyeSlash, 
  FaRegClipboard, 
  FaEdit, 
  FaTrash, 
  FaClock 
} from 'react-icons/fa';

const VaultEntryCard = ({ entry, onCopy, onEdit, onDelete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.password);
    onCopy?.(entry);
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

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);

  const buttonClasses = "p-2 rounded hover:bg-muted dark:hover:bg-dark-muted focus:outline-none focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring";
  const actionButtonClasses = "px-3.5 py-1.5 text-sm rounded font-medium flex items-center shadow-sm transition-colors";

  return (
    <div className="relative w-full">
      {formatLastUpdated && (
        <div className="absolute -top-4 right-2 flex items-center text-xs text-muted-foreground dark:text-dark-muted-foreground bg-card dark:bg-dark-card px-2 py-0.5 rounded-t border-l border-r border-t border-border dark:border-dark-border z-10 shadow-sm">
          <FaClock className="mr-1.5" size={10} />
          {formatLastUpdated}
        </div>
      )}
      
      <div className="bg-card dark:bg-dark-card text-card-foreground dark:text-dark-card-foreground rounded-lg shadow-md dark:shadow-lg border border-border dark:border-dark-border p-5 flex flex-col h-full transition-all duration-200 ease-in-out hover:shadow-xl dark:hover:border-dark-primary">
        <div className="flex flex-col flex-1 mb-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-lg sm:text-xl text-primary dark:text-dark-primary">
              {entry.platform}
            </span>
            <span className="text-muted-foreground dark:text-dark-muted-foreground font-mono text-sm">
              {entry.username}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-3">
            <input
              type={showPassword ? 'text' : 'password'}
              value={entry.password}
              readOnly
              className="flex-grow px-3 py-1.5 rounded border border-border dark:border-dark-border bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring"
            />
            <button
              type="button"
              className={buttonClasses}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <FaEyeSlash className="text-lg text-secondary-foreground dark:text-dark-secondary-foreground" />
              ) : (
                <FaEye className="text-lg text-secondary-foreground dark:text-dark-secondary-foreground" />
              )}
            </button>
            <button
              type="button"
              className={buttonClasses}
              onClick={handleCopy}
              aria-label="Copy password"
            >
              <FaRegClipboard className="text-lg text-tn-green" />
            </button>
          </div>
          
          {entry.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {entry.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-2.5 py-1 rounded-full bg-muted dark:bg-dark-muted text-xs text-muted-foreground dark:text-dark-muted-foreground font-medium border border-border dark:border-dark-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2.5 mt-auto">
          <button
            type="button"
            className={`${actionButtonClasses} bg-primary hover:bg-opacity-80 text-primary-foreground dark:bg-dark-primary dark:hover:bg-opacity-90 dark:text-dark-primary-foreground focus:ring-ring dark:focus:ring-dark-ring focus:ring-opacity-50`}
            onClick={() => onEdit?.(entry)}
          >
            <FaEdit className="text-sm mr-1.5" /> Edit
          </button>
          <button
            type="button"
            className={`${actionButtonClasses} bg-destructive hover:bg-opacity-80 text-destructive-foreground dark:bg-dark-destructive dark:hover:bg-opacity-90 dark:text-dark-destructive-foreground focus:ring-destructive dark:focus:ring-dark-destructive focus:ring-opacity-50`}
            onClick={() => onDelete?.(entry)}
          >
            <FaTrash className="text-sm mr-1.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaultEntryCard;
