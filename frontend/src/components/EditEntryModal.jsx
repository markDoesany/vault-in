import React from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const EditEntryModal = ({
  editModalOpen,
  closeEditModal,
  editEntry,
  editEntryError,
  handleEditEntryChange,
  handleEditEntrySave,
  passwordChecks,
  showPasswordTooltip,
  setShowPasswordTooltip,
}) => {
  if (!editModalOpen) return null;

  const inputBaseClasses = "border rounded px-4 py-2 focus:outline-none font-poppins w-full";
  const themedInputClasses = `${inputBaseClasses} border-border dark:border-dark-border bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring`;
  const themedTextareaClasses = `${themedInputClasses} min-h-[60px]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-70 p-4" onClick={closeEditModal}>
      <form
        className="relative bg-card text-card-foreground dark:bg-dark-card dark:text-dark-card-foreground rounded-2xl shadow-xl border border-border dark:border-dark-border p-6 w-[95vw] max-w-md flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
        onSubmit={handleEditEntrySave}
        autoComplete="off"
      >
        <button
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground focus:outline-none"
          onClick={closeEditModal}
          type="button"
          aria-label="Close edit entry modal"
        >
          <FaTimes size={20}/>
        </button>
        <h2 className="text-xl font-bold text-foreground dark:text-dark-foreground text-center mb-2">Edit Vault Entry</h2>
        {editEntryError && (
          <div className="w-full text-center bg-destructive/10 text-destructive dark:text-dark-destructive border border-destructive dark:border-dark-destructive rounded p-2 mb-2 text-sm">
            {editEntryError}
          </div>
        )}
        <input
          className={themedInputClasses}
          type="text"
          name="platform"
          placeholder="Platform Name"
          value={editEntry.platform}
          onChange={handleEditEntryChange}
          required
          autoFocus
        />
        <input
          className={themedInputClasses}
          type="text"
          name="username"
          placeholder="Username or Email"
          value={editEntry.username}
          onChange={handleEditEntryChange}
          required
        />
        <div className="flex flex-col gap-1 relative">
          <input
            className={themedInputClasses}
            type="password"
            name="password"
            placeholder="Password"
            value={editEntry.password}
            onChange={handleEditEntryChange}
            required
            onFocus={() => setShowPasswordTooltip(true)}
            onBlur={() => setShowPasswordTooltip(false)}
            aria-describedby="edit-password-tooltip"
          />
          {showPasswordTooltip && !passwordChecks.every(check => check.test(editEntry.password)) && (
            <div
              id="edit-password-tooltip"
              className="absolute left-0 top-full mt-1 z-20 w-full bg-popover text-popover-foreground dark:bg-dark-popover dark:text-dark-popover-foreground rounded-lg shadow-md p-3 text-xs border border-border dark:border-dark-border"
            >
              <div className="font-semibold mb-1 text-foreground dark:text-dark-foreground">Password requirements:</div>
              <ul className="space-y-0.5">
                {passwordChecks.map((check, idx) => {
                  const passed = check.test(editEntry.password);
                  return (
                    <li key={idx} className="flex items-center gap-1.5">
                      {passed ? (
                        <FaCheckCircle className="text-tn-green" size={14}/>
                      ) : (
                        <FaTimesCircle className="text-destructive dark:text-dark-destructive" size={14}/>
                      )}
                      <span className={passed ? 'text-foreground dark:text-dark-foreground' : 'text-muted-foreground dark:text-dark-muted-foreground'}>{check.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <input
          className={themedInputClasses}
          type="text"
          name="tags"
          placeholder="Tags (comma separated, e.g. Finance, Email)"
          value={editEntry.tags}
          onChange={handleEditEntryChange}
        />
        <textarea
          className={themedTextareaClasses}
          name="notes"
          placeholder="Optional Notes"
          value={editEntry.notes}
          onChange={handleEditEntryChange}
          rows={2}
        />
        <button
          type="submit"
          className="btn btn-primary w-full mt-2" // Use new button styles
          disabled={!editEntry.platform || !editEntry.username || !editEntry.password || !passwordChecks.every(check => check.test(editEntry.password))}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEntryModal;