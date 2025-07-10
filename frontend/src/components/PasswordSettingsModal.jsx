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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-70 p-4" onClick={onClose}>
      <div 
        className="bg-card text-card-foreground dark:bg-dark-card dark:text-dark-card-foreground rounded-2xl shadow-xl border border-border dark:border-dark-border p-6 w-[95vw] max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground">Password Generator Settings</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground dark:text-dark-muted-foreground dark:hover:text-dark-foreground focus:outline-none"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground dark:text-dark-foreground">Password Length: {settings.length}</span>
            </label>
            <input
              type="range"
              name="length"
              min="8"
              max="32"
              value={settings.length}
              onChange={handleChange}
              className="w-full h-2 bg-muted dark:bg-dark-muted rounded-lg appearance-none cursor-pointer accent-primary dark:accent-dark-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground dark:text-dark-muted-foreground mt-1">
              <span>8</span>
              <span>32</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: "includeUppercase", name: "includeUppercase", label: "Include Uppercase Letters", checked: settings.includeUppercase },
              { id: "includeLowercase", name: "includeLowercase", label: "Include Lowercase Letters", checked: settings.includeLowercase },
              { id: "includeNumbers", name: "includeNumbers", label: "Include Numbers", checked: settings.includeNumbers },
              { id: "includeSymbols", name: "includeSymbols", label: "Include Symbols", checked: settings.includeSymbols },
            ].map(cb => (
              <div className="flex items-center" key={cb.id}>
                <input
                  type="checkbox"
                  id={cb.id}
                  name={cb.name}
                  checked={cb.checked}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary dark:text-dark-primary rounded border-border dark:border-dark-border focus:ring-ring dark:focus:ring-dark-ring bg-input dark:bg-dark-input"
                />
                <label htmlFor={cb.id} className="ml-2 text-sm text-foreground dark:text-dark-foreground">
                  {cb.label}
                </label>
              </div>
            ))}

            {settings.includeSymbols && (
              <div className="ml-6 mt-2">
                <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-1">
                  Max Symbols: {settings.maxSymbols}
                </label>
                <input
                  type="range"
                  name="maxSymbols"
                  min="1"
                  max="5"
                  value={settings.maxSymbols}
                  onChange={handleChange}
                  className="w-full h-2 bg-muted dark:bg-dark-muted rounded-lg appearance-none cursor-pointer accent-primary dark:accent-dark-primary"
                />
                 <div className="flex justify-between text-xs text-muted-foreground dark:text-dark-muted-foreground mt-1">
                  <span>1</span>
                  <span>5</span>
                </div>
              </div>
            )}

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="avoidAmbiguous"
                name="avoidAmbiguous"
                checked={settings.avoidAmbiguous}
                onChange={handleChange}
                className="h-4 w-4 text-primary dark:text-dark-primary rounded border-border dark:border-dark-border focus:ring-ring dark:focus:ring-dark-ring bg-input dark:bg-dark-input"
              />
              <label htmlFor="avoidAmbiguous" className="ml-2 text-sm text-foreground dark:text-dark-foreground">
                Avoid Ambiguous Characters (e.g., l, 1, I, 0, O)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary" // Use semantic button class
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose} // Assuming settings are applied on change, so close acts as save
            className="btn btn-primary" // Use semantic button class
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordSettingsModal;
