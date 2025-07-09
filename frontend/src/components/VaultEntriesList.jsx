import React from 'react';
import VaultEntryCard from './VaultEntryCard';

const VaultEntriesList = ({ entries, onCopy, onEdit, onDelete }) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 px-2 md:px-0">
    {entries.length === 0 ? (
      <div className="text-center text-gray-500 dark:text-gold mt-8 text-lg">
        No vault entries found.
      </div>
    ) : (
      entries.map((entry) => (
        <VaultEntryCard
          key={entry.id}
          entry={entry}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))
    )}
  </div>
);

export default VaultEntriesList;