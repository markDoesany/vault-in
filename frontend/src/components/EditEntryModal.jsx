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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={closeEditModal}>
      <form
        className="relative bg-white dark:bg-primary rounded-2xl shadow-confident border border-silver dark:border-gold p-6 w-[95vw] max-w-md flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
        onSubmit={handleEditEntrySave}
        autoComplete="off"
      >
        <button
          className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gold dark:hover:text-gold focus:outline-none"
          onClick={closeEditModal}
          type="button"
          aria-label="Close edit entry modal"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold text-primary dark:text-gold text-center mb-2">Edit Vault Entry</h2>
        {editEntryError && (
          <div className="w-full text-center bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded p-2 mb-2">
            {editEntryError}
          </div>
        )}
        <input
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins"
          type="text"
          name="platform"
          placeholder="Platform Name"
          value={editEntry.platform}
          onChange={handleEditEntryChange}
          required
          autoFocus
        />
        <input
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins"
          type="text"
          name="username"
          placeholder="Username or Email"
          value={editEntry.username}
          onChange={handleEditEntryChange}
          required
        />
        <div className="flex flex-col gap-1 relative">
          <input
            className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins"
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
              className="absolute left-0 top-12 z-20 w-full bg-white dark:bg-secondary border border-silver dark:border-gold rounded-lg shadow-lg p-4 text-xs text-primary dark:text-gold"
            >
              <div className="font-semibold mb-2 text-gold">Password requirements:</div>
              <ul className="space-y-1">
                {passwordChecks.map((check, idx) => {
                  const passed = check.test(editEntry.password);
                  return (
                    <li key={idx} className="flex items-center gap-2">
                      {passed ? (
                        <FaCheckCircle className="text-green-600 dark:text-green-400" />
                      ) : (
                        <FaTimesCircle className="text-red-600 dark:text-red-400" />
                      )}
                      <span className={passed ? 'text-green-600 dark:text-green-400' : ''}>{check.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <input
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins"
          type="text"
          name="tags"
          placeholder="Tags (comma separated, e.g. Finance, Email)"
          value={editEntry.tags}
          onChange={handleEditEntryChange}
        />
        <textarea
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins min-h-[60px]"
          name="notes"
          placeholder="Optional Notes"
          value={editEntry.notes}
          onChange={handleEditEntryChange}
          rows={2}
        />
        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 rounded-xl bg-gold dark:bg-gold text-primary font-bold shadow-confident border border-silver dark:border-gold hover:bg-silver dark:hover:bg-primary hover:text-gold dark:hover:text-gold transition-colors"
          disabled={!editEntry.platform || !editEntry.username || !passwordChecks.every(check => check.test(editEntry.password))}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditEntryModal;