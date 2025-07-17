const MOCK_DELAY = 500;

const logCall = (functionName, params) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API Call: ${functionName}`, params);
  }
};

const MOCK_VAULT_ENTRIES = [
  {
    id: '1',
    platform: 'Facebook',
    username: 'john.doe',
    password: 'hunter2',
    tags: ['Social'],
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    platform: 'Chase Bank',
    username: 'jane.finance',
    password: 'Super$ecret1',
    tags: ['Finance'],
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    platform: 'Gmail',
    username: 'clint@email.com',
    password: 'EmailPass!2024',
    tags: ['Personal', 'Email'],
    updatedAt: new Date().toISOString(),
  },
];

const processTags = (tags) => {
  if (!tags) return [];
  return Array.isArray(tags) 
    ? tags.filter(tag => tag && tag.trim())
    : tags.split(',').map(tag => tag.trim()).filter(tag => tag);
};

export const loginUser = async (credentials) => {
  logCall('loginUser', credentials);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'testuser' && credentials.password === 'password') {
        resolve({
          success: true,
          message: 'Login successful',
          token: 'fake-jwt-token',
          user: { username: credentials.username, email: 'testuser@example.com' },
        });
      } else {
        reject({
          success: false,
          message: 'Invalid username or password',
        });
      }
    }, MOCK_DELAY);
  });
};

export const signupUser = async (userData) => {
  logCall('signupUser', userData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Signup successful. Please login.',
        user: { username: userData.username, email: userData.email },
      });
    }, MOCK_DELAY);
  });
};

export const getVaultEntries = async () => {
  logCall('getVaultEntries');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        entries: [...MOCK_VAULT_ENTRIES],
      });
    }, MOCK_DELAY);
  });
};

export const addVaultEntry = async (entryData) => {
  logCall('addVaultEntry', entryData);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEntry = {
        ...entryData,
        id: String(Date.now()),
        updatedAt: new Date().toISOString(),
        tags: processTags(entryData.tags),
      };
      MOCK_VAULT_ENTRIES.push(newEntry);
      resolve({
        success: true,
        message: 'Entry added successfully',
        entry: newEntry,
      });
    }, MOCK_DELAY);
  });
};

export const updateVaultEntry = async (entryId, entryData) => {
  logCall('updateVaultEntry', { entryId, entryData });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_VAULT_ENTRIES.findIndex(entry => entry.id === entryId);
      if (index !== -1) {
        const updatedEntry = {
          ...MOCK_VAULT_ENTRIES[index],
          ...entryData,
          tags: entryData.tags ? processTags(entryData.tags) : MOCK_VAULT_ENTRIES[index].tags,
          updatedAt: new Date().toISOString(),
        };
        MOCK_VAULT_ENTRIES[index] = updatedEntry;
        resolve({
          success: true,
          message: 'Entry updated successfully',
          entry: updatedEntry,
        });
      } else {
        reject({
          success: false,
          message: 'Entry not found',
        });
      }
    }, MOCK_DELAY);
  });
};

export const deleteVaultEntry = async (entryId) => {
  logCall('deleteVaultEntry', { entryId });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = MOCK_VAULT_ENTRIES.length;
      MOCK_VAULT_ENTRIES = MOCK_VAULT_ENTRIES.filter(entry => entry.id !== entryId);
      if (MOCK_VAULT_ENTRIES.length < initialLength) {
        resolve({
          success: true,
          message: 'Entry deleted successfully',
        });
      } else {
        reject({
          success: false,
          message: 'Entry not found',
        });
      }
    }, MOCK_DELAY);
  });
};

export const changeMasterPassword = async (passwordData) => {
  logCall('changeMasterPassword', passwordData);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (passwordData.currentPassword === 'password') {
        resolve({
          success: true,
          message: 'Master password changed successfully',
        });
      } else {
        reject({
          success: false,
          message: 'Incorrect current master password',
        });
      }
    }, MOCK_DELAY);
  });
};
