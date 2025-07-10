import React from 'react';

const DeleteConfirmModal = ({
  entryToDelete,
  confirmDeleteEntry,
  cancelDeleteEntry,
}) => {
  if (!entryToDelete) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 dark:bg-opacity-70 p-4">
      <div className="bg-card dark:bg-dark-card text-card-foreground dark:text-dark-card-foreground border border-destructive dark:border-dark-destructive rounded-xl shadow-xl px-8 py-6 flex flex-col items-center max-w-xs w-full">
        <span className="text-3xl mb-2 text-destructive dark:text-dark-destructive">⚠️</span>
        <h3 className="text-lg font-bold text-foreground dark:text-dark-foreground mb-2 text-center">Delete Entry?</h3>
        <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground mb-4 text-center">
          Are you sure you want to delete <span className="font-semibold text-foreground dark:text-dark-foreground">{entryToDelete.platform}</span> ({entryToDelete.username})?
          <br />This action cannot be undone.
        </p>
        <div className="flex gap-4 mt-2">
          <button
            className="btn btn-destructive px-4 py-2 rounded-xl font-bold shadow-md"
            onClick={confirmDeleteEntry}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary px-4 py-2 rounded-xl font-bold shadow-md"
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