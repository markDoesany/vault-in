import React from 'react';

const PasswordSettingsModal = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onSettingsChange({
      ...settings,
      [name]: type === 'checkbox' ? checked : parseInt(value, 10) || value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={onClose}>
      <div 
        className="bg-white dark:bg-primary rounded-2xl shadow-confident border border-silver dark:border-gold p-6 w-[95vw] max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-primary dark:text-gold">Password Generator Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gold dark:hover:text-gold focus:outline-none"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary dark:text-gray-300">Password Length: {settings.length}</span>
            </label>
            <input
              type="range"
              name="length"
              min="8"
              max="32"
              value={settings.length}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeUppercase"
                name="includeUppercase"
                checked={settings.includeUppercase}
                onChange={handleChange}
                className="h-4 w-4 text-gold rounded border-gray-300 focus:ring-gold"
              />
              <label htmlFor="includeUppercase" className="ml-2 text-sm text-primary dark:text-gray-300">
                Include Uppercase Letters
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeLowercase"
                name="includeLowercase"
                checked={settings.includeLowercase}
                onChange={handleChange}
                className="h-4 w-4 text-gold rounded border-gray-300 focus:ring-gold"
              />
              <label htmlFor="includeLowercase" className="ml-2 text-sm text-primary dark:text-gray-300">
                Include Lowercase Letters
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeNumbers"
                name="includeNumbers"
                checked={settings.includeNumbers}
                onChange={handleChange}
                className="h-4 w-4 text-gold rounded border-gray-300 focus:ring-gold"
              />
              <label htmlFor="includeNumbers" className="ml-2 text-sm text-primary dark:text-gray-300">
                Include Numbers
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeSymbols"
                name="includeSymbols"
                checked={settings.includeSymbols}
                onChange={handleChange}
                className="h-4 w-4 text-gold rounded border-gray-300 focus:ring-gold"
              />
              <label htmlFor="includeSymbols" className="ml-2 text-sm text-primary dark:text-gray-300">
                Include Symbols
              </label>
            </div>

            {settings.includeSymbols && (
              <div className="ml-6 mt-2">
                <label className="block text-sm font-medium text-primary dark:text-gray-300 mb-1">
                  Max Symbols: {settings.maxSymbols}
                </label>
                <input
                  type="range"
                  name="maxSymbols"
                  min="1"
                  max="5"
                  value={settings.maxSymbols}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
                />
              </div>
            )}

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="avoidAmbiguous"
                name="avoidAmbiguous"
                checked={settings.avoidAmbiguous}
                onChange={handleChange}
                className="h-4 w-4 text-gold rounded border-gray-300 focus:ring-gold"
              />
              <label htmlFor="avoidAmbiguous" className="ml-2 text-sm text-primary dark:text-gray-300">
                Avoid Ambiguous Characters (e.g., l, 1, I, 0, O)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gold hover:bg-yellow-600 rounded-md transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettingsModal;
