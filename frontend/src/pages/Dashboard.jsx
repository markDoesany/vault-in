import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaUserCircle, FaPlusCircle, FaTimes } from 'react-icons/fa';
import PasswordSettingsModal from '../components/PasswordSettingsModal';
import SessionTimer from '../components/SessionTimer';
import SummaryStats from '../components/SummaryStats';
import SearchAddBar from '../components/SearchAddBar';
import VaultEntriesList from '../components/VaultEntriesList';
import ProfileSection from '../components/ProfileSection';
import AddEntryModal from '../components/AddEntryModal';
import EditEntryModal from '../components/EditEntryModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import CopySuccessModal from '../components/CopySuccessModal';
import SessionLogoutModal from '../components/SessionLogoutModal';
import ChangeMasterPasswordModal from '../components/ChangeMasterPasswordModal'; // Import the new modal
import { useNavigate } from 'react-router-dom';

const MOCK_ENTRIES = [
  {
    id: 1,
    platform: 'Facebook',
    username: 'john.doe',
    password: 'hunter2',
    tags: ['Social'],
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: 2,
    platform: 'Chase Bank',
    username: 'jane.finance',
    password: 'Super$ecret1',
    tags: ['Finance'],
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 3,
    platform: 'Gmail',
    username: 'clint@email.com',
    password: 'EmailPass!2024',
    tags: ['Personal', 'Email'],
    updatedAt: new Date().toISOString(), // Now
  },
];

const Dashboard = () => {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [profileOpen, setProfileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    platform: '',
    username: '',
    password: '',
    notes: '',
    tags: '', // store as comma-separated string for input
  });
  // const [passwordStrength, setPasswordStrength] = useState(''); // Removed unused variable
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [addEntryError, setAddEntryError] = useState('');

  const generatePassword = () => {
    const {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      maxSymbols,
      avoidAmbiguous
    } = passwordSettings;

    // Character sets
    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Remove ambiguous characters if needed
    if (avoidAmbiguous) {
      const ambiguous = 'l1I0O';
      lowercase = lowercase.split('').filter(c => !ambiguous.includes(c)).join('');
      uppercase = uppercase.split('').filter(c => !ambiguous.includes(c)).join('');
      numbers = numbers.split('').filter(c => !ambiguous.includes(c)).join('');
      symbols = symbols.split('').filter(c => !'{}[]()/\\`~,;:.<>'.includes(c)).join('');
    }

    // Build character pool based on settings
    let charPool = '';
    const requiredChars = [];
    
    if (includeLowercase) {
      charPool += lowercase;
      requiredChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);
    }
    if (includeUppercase) {
      charPool += uppercase;
      requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
    }
    if (includeNumbers) {
      charPool += numbers;
      requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    if (includeSymbols) {
      charPool += symbols;
      requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    // Start with required characters
    let password = requiredChars.join('');
    
    // Generate remaining characters
    const remainingLength = Math.max(0, length - password.length);
    let symbolCount = password.split('').filter(c => symbols.includes(c)).length;
    
    for (let i = 0; i < remainingLength; i++) {
      // If we've reached max symbols, exclude them from the pool
      const currentPool = (includeSymbols && symbolCount < maxSymbols) 
        ? charPool 
        : charPool.split('').filter(c => !symbols.includes(c)).join('');
      
      const randomChar = currentPool[Math.floor(Math.random() * currentPool.length)];
      
      if (symbols.includes(randomChar)) {
        symbolCount++;
      }
      
      password += randomChar;
    }
    
    // Shuffle the password to make it more random
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    // Update the password field and strength
    setNewEntry(prev => ({ ...prev, password }));
    // setPasswordStrength(checkStrength(password)); // setPasswordStrength was removed
  };
  // Password generation settings
  const [passwordSettings, setPasswordSettings] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    maxSymbols: 2,
    avoidAmbiguous: true
  });
  
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  
  const handlePasswordSettingsChange = (newSettings) => {
    setPasswordSettings(newSettings);
  };
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState(null);
  const [editEntry, setEditEntry] = useState({
    platform: '',
    username: '',
    password: '',
    notes: '',
    tags: '',
  });
  const [editEntryError, setEditEntryError] = useState('');

  const navigate = useNavigate();
  const SESSION_DURATION = 60 * 60; // seconds, for testing
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_DURATION);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutCountdown, setLogoutCountdown] = useState(3);
  const [isChangeMasterPasswordModalOpen, setIsChangeMasterPasswordModalOpen] = useState(false); // State for the new modal

  useEffect(() => {
    let timer;
    if (sessionTimeLeft > 0) {
      timer = setInterval(() => {
        setSessionTimeLeft((prev) => {
          if (prev <= 1) {
            setShowLogoutModal(true);
            localStorage.removeItem('vault_session_expiry');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setShowLogoutModal(true);
    }
    return () => clearInterval(timer);
  }, [sessionTimeLeft]);

  useEffect(() => {
    // Initialize session time from localStorage
    const stored = localStorage.getItem('vault_session_expiry');
    if (stored) {
      console.log('Stored expiry:', stored);
      const diff = Math.floor((parseInt(stored, 10) - Date.now()) / 1000);
      setSessionTimeLeft(diff > 0 ? diff : 0);
    }

    // Set new session expiry if needed
    if (!stored || parseInt(stored, 10) < Date.now()) {
      localStorage.setItem('vault_session_expiry', Date.now() + SESSION_DURATION * 1000);
    }
  }, [SESSION_DURATION]); // Added SESSION_DURATION to dependency array

  useEffect(() => {
    let logoutTimer;
    if (showLogoutModal) {
      logoutTimer = setInterval(() => {
        setLogoutCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(logoutTimer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setLogoutCountdown(3);
    }
    return () => clearInterval(logoutTimer);
  }, [showLogoutModal, navigate]);

  const passwordChecks = [
    {
      label: 'At least 8 characters',
      test: (pw) => pw.length >= 8,
    },
    {
      label: 'At least one uppercase letter',
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      label: 'At least one lowercase letter',
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      label: 'At least one number',
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      label: 'At least one special character',
      test: (pw) => /[^A-Za-z0-9]/.test(pw),
    },
  ];

  // const allPasswordValid = passwordChecks.every(check => check.test(newEntry.password)); // Removed unused variable

  // Placeholder handlers
  const handleCopy = (entry) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(entry.password).then(() => {
        setShowCopyModal(true);
        setTimeout(() => setShowCopyModal(false), 1500);
      });
    }
  };
  const handleEdit = (entry) => {
    openEditModal(entry);
  };
  const handleDelete = (entry) => {
    setEntryToDelete(entry);
  };
  const confirmDeleteEntry = () => {
    setEntries((prev) => prev.filter((e) => e.id !== entryToDelete.id));
    setEntryToDelete(null);
  };
  const cancelDeleteEntry = () => setEntryToDelete(null);

  const openAddModal = () => {
    setAddModalOpen(true);
    setNewEntry({ platform: '', username: '', password: '', notes: '', tags: '' });
    // setPasswordStrength(''); // Removed as setPasswordStrength is not defined
  };
  const closeAddModal = () => setAddModalOpen(false);

  const handleNewEntryChange = e => {
    const { name, value } = e.target;
    setNewEntry(prev => ({ ...prev, [name]: value }));
    // if (name === 'password') setPasswordStrength(checkStrength(value)); // setPasswordStrength was removed
  };

  // function checkStrength(pw) { // Removed as it's no longer used
  //   if (!pw) return '';
  //   let score = 0;
  //   if (pw.length >= 8) score++;
  //   if (/[A-Z]/.test(pw)) score++;
  //   if (/[a-z]/.test(pw)) score++;
  //   if (/[0-9]/.test(pw)) score++;
  //   if (/[^A-Za-z0-9]/.test(pw)) score++;
  //   if (score >= 5) return 'Strong';
  //   if (score >= 3) return 'Medium';
  //   return 'Weak';
  // }

  const handleAddEntry = (e) => {
    e.preventDefault();
    // Basic validation
    if (!newEntry.platform || !newEntry.username || !newEntry.password) {
      setAddEntryError('Please fill in all required fields');
      return;
    }

    // Check password strength
    if (!passwordChecks.every(check => check.test(newEntry.password))) {
      setAddEntryError('Password does not meet requirements');
      return;
    }

    const newId = Math.max(...entries.map(entry => entry.id), 0) + 1;
    const newEntryWithId = {
      ...newEntry,
      id: newId,
      tags: newEntry.tags ? newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      updatedAt: new Date().toISOString(),
    };

    setEntries([...entries, newEntryWithId]);
    setAddModalOpen(false);
    setNewEntry({
      platform: '',
      username: '',
      password: '',
      notes: '',
      tags: '',
    });
    setAddEntryError('');
  };

  const openEditModal = (entry) => {
    setEntryToEdit(entry);
    setEditEntry({
      platform: entry.platform,
      username: entry.username,
      password: entry.password,
      notes: entry.notes || '',
      tags: entry.tags ? entry.tags.join(', ') : '',
    });
    setEditEntryError('');
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEntryToEdit(null);
  };
  const handleEditEntryChange = e => {
    const { name, value } = e.target;
    setEditEntry(prev => ({ ...prev, [name]: value }));
    setEditEntryError('');
  };
  const handleEditEntrySave = e => {
    e.preventDefault();
    const missing = [];
    if (!editEntry.platform) missing.push('Platform Name');
    if (!editEntry.username) missing.push('Username/Email');
    if (!editEntry.password) missing.push('Password');
    if (!passwordChecks.every(check => check.test(editEntry.password))) missing.push('Password Requirements');
    if (missing.length > 0) {
      setEditEntryError(`Missing or invalid: ${missing.join(', ')}`);
      return;
    }
    const updatedEntries = entries.map(entry =>
      entry.id === entryToEdit.id
        ? { 
            ...entryToEdit, 
            tags: editEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            updatedAt: new Date().toISOString()
          }
        : entry
    );
    setEntries(updatedEntries);
    setEditModalOpen(false);
    setEntryToEdit(null);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-primary font-poppins flex flex-col">
      <SessionTimer sessionTimeLeft={sessionTimeLeft} />
      <SummaryStats entries={entries} lastActivity={sessionTimeLeft} />
      <SearchAddBar openAddModal={openAddModal} />
      <VaultEntriesList entries={entries} onCopy={handleCopy} onEdit={handleEdit} onDelete={handleDelete} />
      <ProfileSection
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        openChangeMasterPasswordModal={() => setIsChangeMasterPasswordModalOpen(true)} // Pass handler to open modal
      />
      <AddEntryModal
        addModalOpen={addModalOpen}
        closeAddModal={closeAddModal}
        newEntry={newEntry}
        addEntryError={addEntryError}
        handleAddEntryChange={handleNewEntryChange}
        handleAddEntrySave={handleAddEntry}
        passwordChecks={passwordChecks}
        showPasswordTooltip={showPasswordTooltip}
        setShowPasswordTooltip={setShowPasswordTooltip}
        generatePassword={generatePassword}
        passwordSettings={passwordSettings}
        setPasswordSettings={handlePasswordSettingsChange}
        showPasswordSettings={showPasswordSettings}
        setShowPasswordSettings={setShowPasswordSettings}
      />
      
      <PasswordSettingsModal
        isOpen={showPasswordSettings}
        onClose={() => setShowPasswordSettings(false)}
        settings={passwordSettings}
        onSettingsChange={handlePasswordSettingsChange}
      />
      <EditEntryModal
        editModalOpen={editModalOpen}
        closeEditModal={closeEditModal}
        editEntry={editEntry}
        editEntryError={editEntryError}
        handleEditEntryChange={handleEditEntryChange}
        handleEditEntrySave={handleEditEntrySave}
        passwordChecks={passwordChecks}
        showPasswordTooltip={showPasswordTooltip}
        setShowPasswordTooltip={setShowPasswordTooltip}
      />
      <DeleteConfirmModal
        entryToDelete={entryToDelete}
        confirmDeleteEntry={confirmDeleteEntry}
        cancelDeleteEntry={cancelDeleteEntry}
      />
      <CopySuccessModal showCopyModal={showCopyModal} />
      <SessionLogoutModal showLogoutModal={showLogoutModal} logoutCountdown={logoutCountdown} />
      <ChangeMasterPasswordModal
        isOpen={isChangeMasterPasswordModalOpen}
        onClose={() => setIsChangeMasterPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
