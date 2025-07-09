import React, { useState } from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash, FaCog } from 'react-icons/fa';

const AddEntryModal = ({
  addModalOpen,
  closeAddModal,
  newEntry,
  addEntryError,
  handleAddEntryChange,
  handleAddEntrySave,
  passwordChecks,
  showPasswordTooltip,
  setShowPasswordTooltip,
  generatePassword,
  passwordSettings,
  setPasswordSettings,
  showPasswordSettings,
  setShowPasswordSettings,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  if (!addModalOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={closeAddModal}>
      <form
        className="relative bg-white dark:bg-primary rounded-2xl shadow-confident border border-silver dark:border-gold p-6 w-[95vw] max-w-md flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
        onSubmit={handleAddEntrySave}
        autoComplete="off"
      >
        <button
          className="absolute top-2 right-2 text-xl text-gray-400 hover:text-gold dark:hover:text-gold focus:outline-none"
          onClick={closeAddModal}
          type="button"
          aria-label="Close add entry modal"
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-bold text-primary dark:text-gold text-center mb-2">Add New Vault Entry</h2>
        {addEntryError && (
          <div className="w-full text-center bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded p-2 mb-2">
            {addEntryError}
          </div>
        )}
        <input
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins"
          type="text"
          name="platform"
          placeholder="Platform Name"
          value={newEntry.platform}
          onChange={handleAddEntryChange}
          required
          autoFocus
        />
        <input
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins"
          type="text"
          name="username"
          placeholder="Username or Email"
          value={newEntry.username}
          onChange={handleAddEntryChange}
          required
        />
        <div className="flex flex-col gap-1 relative">
          <div className="relative">
            <div className="relative">
              <input
                className="w-full border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins pr-28"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={newEntry.password}
                onChange={handleAddEntryChange}
                required
                onFocus={() => setShowPasswordTooltip(true)}
                onBlur={() => setShowPasswordTooltip(false)}
                aria-describedby="add-password-tooltip"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-500 hover:text-gold dark:text-gray-400 dark:hover:text-gold transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="bg-gold hover:bg-yellow-600 text-white text-xs font-medium px-2 py-1 rounded transition-colors"
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordSettings(true)}
                    className="text-gray-500 hover:text-gold dark:text-gray-400 dark:hover:text-gold transition-colors p-1"
                    title="Password settings"
                  >
                    <FaCog />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {showPasswordTooltip && !passwordChecks.every(check => check.test(newEntry.password)) && (
            <div
              id="add-password-tooltip"
              className="absolute left-0 top-12 z-20 w-full bg-white dark:bg-secondary border border-silver dark:border-gold rounded-lg shadow-lg p-4 text-xs text-primary dark:text-gold"
            >
              <div className="font-semibold mb-2 text-gold">Password requirements:</div>
              <ul className="space-y-1">
                {passwordChecks.map((check, idx) => {
                  const passed = check.test(newEntry.password);
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
          value={newEntry.tags}
          onChange={handleAddEntryChange}
        />
        <textarea
          className="border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins min-h-[60px]"
          name="notes"
          placeholder="Optional Notes"
          value={newEntry.notes}
          onChange={handleAddEntryChange}
          rows={2}
        />
        <button
          type="submit"
          className="w-full mt-2 px-4 py-2 rounded-xl bg-gold dark:bg-gold text-primary font-bold shadow-confident border border-silver dark:border-gold hover:bg-silver dark:hover:bg-primary hover:text-gold dark:hover:text-gold transition-colors"
          disabled={
            !newEntry.platform ||
            !newEntry.username ||
            !passwordChecks.every(check => check.test(newEntry.password))
          }
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default AddEntryModal;