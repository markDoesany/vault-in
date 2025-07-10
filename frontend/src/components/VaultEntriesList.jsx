import React from 'react';
import VaultEntryCard from './VaultEntryCard';

const VaultEntriesList = ({ entries, onCopy, onEdit, onDelete }) => (
  <div className="w-full max-w-4xl mx-auto px-2 md:px-0">
    {entries.length === 0 ? (
      <div className="text-center text-muted-foreground dark:text-dark-muted-foreground mt-8 text-lg">
        No vault entries found.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <VaultEntryCard
            key={entry.id}
            entry={entry}
            onCopy={onCopy}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    )}
  </div>
);

export default VaultEntriesList;