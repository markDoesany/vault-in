import React from 'react';

const SummaryStats = ({ entries, lastActivity }) => {
  const lastAdded = entries.length > 0 ? entries[entries.length - 1].platform : '—';
  const lastActivityDisplay = lastActivity
    ? new Date(lastActivity).toLocaleString()
    : '—';

  return (
    <section className="w-full max-w-4xl mx-auto mt-6 mb-4 flex flex-col md:flex-row flex-wrap gap-4 md:gap-4 justify-between items-stretch px-2 md:px-0">
      <div className="flex-1 bg-card dark:bg-dark-card text-card-foreground dark:text-dark-card-foreground rounded-xl shadow-lg border border-border dark:border-dark-border p-4 flex flex-col items-center mb-2 md:mb-0 min-w-[150px]">
        <span className="text-lg font-bold text-primary dark:text-dark-primary">{entries.length}</span>
        <span className="text-xs text-muted-foreground dark:text-dark-muted-foreground">Entries</span>
      </div>
      <div className="flex-1 bg-card dark:bg-dark-card text-card-foreground dark:text-dark-card-foreground rounded-xl shadow-lg border border-border dark:border-dark-border p-4 flex flex-col items-center mb-2 md:mb-0 min-w-[150px]">
        <span className="text-lg font-bold text-primary dark:text-dark-primary">{lastAdded}</span>
        <span className="text-xs text-muted-foreground dark:text-dark-muted-foreground">Last Added</span>
      </div>
      <div className="flex-1 bg-card dark:bg-dark-card text-card-foreground dark:text-dark-card-foreground rounded-xl shadow-lg border border-border dark:border-dark-border p-4 flex flex-col items-center min-w-[150px]">
        <span className="text-lg font-bold text-primary dark:text-dark-primary">{lastActivityDisplay}</span>
        <span className="text-xs text-muted-foreground dark:text-dark-muted-foreground">Last User Activity</span>
      </div>
    </section>
  );
};

export default SummaryStats;