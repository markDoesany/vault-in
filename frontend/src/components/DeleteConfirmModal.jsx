import React from 'react';

const DeleteConfirmModal = ({
  entryToDelete,
  confirmDeleteEntry,
  cancelDeleteEntry,
}) => {
  if (!entryToDelete) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-secondary border border-red-500 dark:border-red-400 rounded-xl shadow-confident px-8 py-6 flex flex-col items-center max-w-xs w-full">
        <span className="text-3xl mb-2 text-red-500 dark:text-red-400">⚠️</span>
        <h3 className="text-lg font-bold text-primary dark:text-gold mb-2 text-center">Delete Entry?</h3>
        <p className="text-sm text-gray-700 dark:text-gold mb-4 text-center">
          Are you sure you want to delete <span className="font-semibold">{entryToDelete.platform}</span> ({entryToDelete.username})?
          <br />This action cannot be undone.
        </p>
        <div className="flex gap-4 mt-2">
          <button
            className="px-4 py-2 rounded-xl bg-red-500 dark:bg-red-700 text-white font-bold shadow-confident border border-red-500 dark:border-red-400 hover:bg-red-600 dark:hover:bg-primary hover:text-gold dark:hover:text-gold transition-colors"
            onClick={confirmDeleteEntry}
          >
            Delete
          </button>
          <button
            className="px-4 py-2 rounded-xl bg-silver dark:bg-gold text-primary font-bold shadow-confident border border-silver dark:border-gold hover:bg-gold dark:hover:bg-primary hover:text-gold dark:hover:text-gold transition-colors"
            onClick={cancelDeleteEntry}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;