import React, { useState, useEffect } from 'react';
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
import ChangeMasterPasswordModal from '../components/ChangeMasterPasswordModal';
import { useNavigate } from 'react-router-dom';
import { getVaultEntries, addVaultEntry, updateVaultEntry, deleteVaultEntry } from '../services/api';

const Dashboard = () => {
  const [entries, setEntries] = useState([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [errorEntries, setErrorEntries] = useState('');

  const [profileOpen, setProfileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    platform: '',
    username: '',
    password: '',
    notes: '',
    tags: '',
  });
  
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [addEntryError, setAddEntryError] = useState('');
  
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showSessionLogoutModal, setShowSessionLogoutModal] = useState(false);
  const [showChangeMasterPasswordModal, setShowChangeMasterPasswordModal] = useState(false);
  const [passwordSettings, setPasswordSettings] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    maxSymbols: 5,
    avoidAmbiguous: true
  });
  
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  
  const navigate = useNavigate();
  
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

    let lowercase = 'abcdefghijklmnopqrstuvwxyz';
    let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numbers = '0123456789';
    let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (avoidAmbiguous) {
      const ambiguous = 'l1I0O';
      lowercase = lowercase.split('').filter(c => !ambiguous.includes(c)).join('');
      uppercase = uppercase.split('').filter(c => !ambiguous.includes(c)).join('');
      numbers = numbers.split('').filter(c => !ambiguous.includes(c)).join('');
      symbols = symbols.split('').filter(c => !ambiguous.includes(c)).join('');
    }

    let allChars = '';
    let password = [];
    
    if (includeLowercase) allChars += lowercase;
    if (includeUppercase) allChars += uppercase;
    if (includeNumbers) allChars += numbers;
    
    const symbolCount = Math.min(Math.floor(Math.random() * maxSymbols) + 1, maxSymbols);
    
    if (includeSymbols && allChars) {
      for (let i = 0; i < symbolCount; i++) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        password.push(symbols[randomIndex]);
      }
    }
    
    const remainingLength = length - password.length;
    
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password.push(allChars[randomIndex]);
    }
    
    for (let i = password.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [password[i], password[j]] = [password[j], password[i]];
    }
    
    return password.join('');
  };
  
  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setNewEntry({ ...newEntry, password: newPassword });
    setShowPasswordTooltip(true);
    setTimeout(() => setShowPasswordTooltip(false), 2000);
  };
  
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };
  
  const fetchVaultEntries = async () => {
    try {
      setIsLoadingEntries(true);
      const data = await getVaultEntries();
      setEntries(data);
      setErrorEntries('');
    } catch (error) {
      console.error('Error fetching vault entries:', error);
      setErrorEntries('Failed to load vault entries. Please try again.');
    } finally {
      setIsLoadingEntries(false);
    }
  };
  
  useEffect(() => {
    fetchVaultEntries();
  }, []);
  
  const handleAddEntry = async (e) => {
    e.preventDefault();
    setAddEntryError('');
    
    try {
      const tagsArray = newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const entryToAdd = {
        ...newEntry,
        tags: tagsArray
      };
      
      await addVaultEntry(entryToAdd);
      setAddModalOpen(false);
      setNewEntry({
        platform: '',
        username: '',
        password: '',
        notes: '',
        tags: '',
      });
      fetchVaultEntries();
    } catch (error) {
      console.error('Error adding entry:', error);
      setAddEntryError(error.message || 'Failed to add entry. Please try again.');
    }
  };
  
  const handleUpdateEntry = async (updatedEntry) => {
    try {
      const tagsArray = updatedEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await updateVaultEntry(updatedEntry.id, {
        ...updatedEntry,
        tags: tagsArray
      });
      setEditingEntry(null);
      fetchVaultEntries();
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };
  
  const handleDeleteEntry = async () => {
    if (!deletingEntry) return;
    
    try {
      await deleteVaultEntry(deletingEntry.id);
      setDeletingEntry(null);
      fetchVaultEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };
  
  const filteredEntries = (Array.isArray(entries) ? entries : []).filter(entry => 
    entry && 
    (entry.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(entry.tags) && entry.tags.some(tag => 
      typeof tag === 'string' && tag.toLowerCase().includes(searchQuery.toLowerCase())
    )))
  );
  
  const stats = {
    totalEntries: Array.isArray(entries) ? entries.length : 0,
    weakPasswords: (Array.isArray(entries) ? entries : []).filter(entry => entry.password && entry.password.length < 8).length,
    reusedPasswords: (() => {
      const passwordMap = new Map();
      (Array.isArray(entries) ? entries : []).forEach(entry => {
        if (entry.password) {
          passwordMap.set(entry.password, (passwordMap.get(entry.password) || 0) + 1);
        }
      });
      return Array.from(passwordMap.values()).filter(count => count > 1).length;
    })(),
  };
  
  return (
    <div className="min-h-screen bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground">
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">Vault-In</h1>
            <div className="flex items-center space-x-4">
              <SessionTimer 
                onLogoutWarning={() => setShowSessionLogoutModal(true)} 
                onLogout={() => navigate('/login')} 
              />
            </div>
            <ProfileSection 
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            openChangeMasterPasswordModal={() => setShowChangeMasterPasswordModal(true)}
          />
          </div>
          
          <SummaryStats stats={stats} />
          
          <SearchAddBar 
            search={searchQuery}
            setSearch={setSearchQuery}
            openAddModal={() => setAddModalOpen(true)}
          />
          
          <VaultEntriesList 
            entries={filteredEntries}
            isLoading={isLoadingEntries}
            error={errorEntries}
            onEdit={setEditingEntry}
            onDelete={setDeletingEntry}
            onCopy={handleCopyToClipboard}
          />
        </div>
        
        <AddEntryModal
          addModalOpen={addModalOpen}
          closeAddModal={() => setAddModalOpen(false)}
          newEntry={newEntry}
          addEntryError={addEntryError}
          handleAddEntryChange={(e) => setNewEntry({...newEntry, [e.target.name]: e.target.value})}
          handleAddEntrySave={handleAddEntry}
          passwordChecks={[
            { test: (p) => p.length >= 8, label: 'At least 8 characters' },
            { test: (p) => /[A-Z]/.test(p), label: 'At least one uppercase letter' },
            { test: (p) => /[a-z]/.test(p), label: 'At least one lowercase letter' },
            { test: (p) => /[0-9]/.test(p), label: 'At least one number' },
            { test: (p) => /[^A-Za-z0-9]/.test(p), label: 'At least one special character' }
          ]}
          generatePassword={handleGeneratePassword}
          setShowPasswordSettings={setShowPasswordSettings}
          passwordSettings={passwordSettings}
          onPasswordSettingsChange={setPasswordSettings}
        />
        
        <PasswordSettingsModal
          isOpen={showPasswordSettings}
          onClose={() => setShowPasswordSettings(false)}
          settings={passwordSettings}
          onSettingsChange={setPasswordSettings}
        />
        
        {editingEntry && (
          <EditEntryModal
            entry={editingEntry}
            onClose={() => setEditingEntry(null)}
            onSave={handleUpdateEntry}
            onCopy={handleCopyToClipboard}
          />
        )}
        
        {deletingEntry && (
          <DeleteConfirmModal
            entry={deletingEntry}
            onClose={() => setDeletingEntry(null)}
            onConfirm={handleDeleteEntry}
          />
        )}
        
        <CopySuccessModal 
          isOpen={showCopySuccess} 
          onClose={() => setShowCopySuccess(false)} 
        />
        
        <SessionLogoutModal
          isOpen={showSessionLogoutModal}
          onClose={() => setShowSessionLogoutModal(false)}
          onLogout={() => navigate('/login')}
        />
        
        <ChangeMasterPasswordModal
          isOpen={showChangeMasterPasswordModal}
          onClose={() => setShowChangeMasterPasswordModal(false)}
          onPasswordChanged={() => {
            setShowChangeMasterPasswordModal(false);
            setProfileOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
