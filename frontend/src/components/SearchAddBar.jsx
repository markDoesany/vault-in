import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';

const SearchAddBar = ({ search, setSearch, openAddModal }) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-2 md:px-0 mt-4 mb-6">
    <input
      className="flex-1 border border-gray-200 dark:border-gold rounded px-4 py-2 focus:outline-none focus:border-gold dark:focus:border-gold bg-gray-50 dark:bg-secondary text-primary dark:text-gold font-poppins"
      type="text"
      placeholder="Search vault entries..."
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold dark:bg-gold text-primary font-bold shadow-confident border border-silver dark:border-gold hover:bg-silver dark:hover:bg-primary hover:text-gold dark:hover:text-gold transition-colors text-lg"
      onClick={openAddModal}
      type="button"
    >
      <FaPlusCircle className="text-xl" />
      Add New
    </button>
  </div>
);

export default SearchAddBar;