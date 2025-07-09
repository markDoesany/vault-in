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
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'success', 'error'
  const [saveMessage, setSaveMessage] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmitInternal = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    setSaveMessage('');

    try {
      await handleAddEntrySave(e); // Pass the event if the original handler expects it
      setSaveStatus('success');
      setSaveMessage('Vault entry saved successfully!');
      // Parent component is expected to close the modal and reset form on actual success
      // If not, we might need to clear newEntry state here or via a callback
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage(error.message || 'Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset save status when modal is closed/reopened
  React.useEffect(() => {
    if (!addModalOpen) {
      setSaveStatus(null);
      setSaveMessage('');
      setIsSaving(false); // Ensure saving state is reset
    }
  }, [addModalOpen]);


  if (!addModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={closeAddModal}>
      <form
        className="relative bg-background border border-border shadow-lg rounded-lg p-6 w-[95vw] max-w-md flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmitInternal}
        autoComplete="off"
      >
        <button
          className="absolute top-3 right-3 text-text-secondary hover:text-text-primary"
          onClick={closeAddModal}
          type="button"
          aria-label="Close add entry modal"
          disabled={isSaving}
        >
          <FaTimes size={20}/>
        </button>
        <h2 className="text-xl font-semibold text-text-primary text-center mb-2">Add New Vault Entry</h2>

        {/* Save Status Messages */}
        {saveStatus === 'success' && (
          <div className="flex items-center bg-green-50 border-l-4 border-success text-success p-3 rounded-md mb-3">
            <FaCheckCircle className="mr-2" />
            <span className="text-sm font-semibold">{saveMessage}</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center bg-red-50 border-l-4 border-error text-error p-3 rounded-md mb-3">
            <FaTimesCircle className="mr-2" />
            <span className="text-sm font-semibold">{saveMessage}</span>
          </div>
        )}
        {/* Display existing addEntryError if no save attempt has been made or if it's a different kind of error */}
        {addEntryError && !saveStatus && (
          <div className="w-full text-center bg-red-50 text-error border border-error rounded p-2 mb-2 text-sm">
            {addEntryError}
          </div>
        )}

        {/* Hide form fields on successful save to prevent re-submission, show a clear message */}
        {saveStatus !== 'success' && (
          <>
            <input
              className="w-full" // Inherits global input style from index.css
              type="text"
              name="platform"
              placeholder="Platform Name (e.g., Google, Facebook)"
              value={newEntry.platform}
              onChange={handleAddEntryChange}
              required
              autoFocus
              disabled={isSaving}
            />
            <input
              className="w-full" // Inherits global input style
              type="text"
              name="username"
              placeholder="Username or Email"
              value={newEntry.username}
              onChange={handleAddEntryChange}
              required
              disabled={isSaving}
            />
            <div className="flex flex-col gap-1 relative">
              <div className="relative">
                <input
                  className="w-full pr-28" // Inherits global style, pr for buttons
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={newEntry.password}
                  onChange={handleAddEntryChange}
                  required
                  onFocus={() => setShowPasswordTooltip(true)}
                  onBlur={() => setShowPasswordTooltip(false)}
                  aria-describedby="add-password-tooltip"
                  disabled={isSaving}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={isSaving}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="btn btn-secondary text-xs px-2 py-1 h-7" // Re-style generate button
                    disabled={isSaving}
                  >
                    Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordSettings(true)}
                    className="p-1 text-text-secondary hover:text-text-primary transition-colors"
                    title="Password settings"
                    disabled={isSaving}
                  >
                    <FaCog size={16} />
                  </button>
                </div>
              </div>
              {showPasswordTooltip && newEntry.password && !passwordChecks.every(check => check.test(newEntry.password)) && (
                <div
                  id="add-password-tooltip"
                  className="absolute left-0 top-full mt-1 z-20 w-full bg-secondary text-text-primary rounded-lg shadow-md p-3 text-xs border border-border"
                >
                  <div className="font-semibold mb-1 text-text-primary">Password requirements:</div>
                  <ul className="space-y-0.5">
                    {passwordChecks.map((check, idx) => {
                      const passed = check.test(newEntry.password);
                      return (
                        <li key={idx} className="flex items-center gap-1.5">
                          {passed ? (
                            <FaCheckCircle className="text-success" size={14}/>
                          ) : (
                            <FaTimesCircle className="text-error" size={14}/>
                          )}
                          <span className={passed ? 'text-text-primary' : 'text-text-secondary'}>{check.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <input
              className="w-full" // Inherits global style
              type="text"
              name="tags"
              placeholder="Tags (comma separated, e.g. Finance, Email)"
              value={newEntry.tags}
              onChange={handleAddEntryChange}
              disabled={isSaving}
            />
            <textarea
              className="w-full min-h-[60px]" // Inherits global style
              name="notes"
              placeholder="Optional Notes"
              value={newEntry.notes}
              onChange={handleAddEntryChange}
              rows={2}
              disabled={isSaving}
            />
            <button
              type="submit"
              className="btn btn-primary w-full mt-2" // Use new button styles
              disabled={
                isSaving ||
                !newEntry.platform ||
                !newEntry.username ||
                !newEntry.password || // Also ensure password is not empty
                !passwordChecks.every(check => check.test(newEntry.password))
              }
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default AddEntryModal;