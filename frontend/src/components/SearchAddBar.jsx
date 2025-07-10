import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';

const SearchAddBar = ({ search, setSearch, openAddModal }) => (
  <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-2 md:px-0 mt-4 mb-6">
    <input
      className="flex-1 border border-border dark:border-dark-border rounded px-4 py-2 focus:outline-none focus:border-ring dark:focus:border-dark-ring focus:ring-1 focus:ring-ring dark:focus:ring-dark-ring bg-input dark:bg-dark-input text-foreground dark:text-dark-foreground placeholder-muted-foreground dark:placeholder-dark-muted-foreground font-poppins"
      type="text"
      placeholder="Search vault entries..."
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    <button
      className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-lg shadow-md" // Using btn-primary and ensuring icon alignment
      onClick={openAddModal}
      type="button"
    >
      <FaPlusCircle className="text-xl" /> {/* Icon color will be inherited from btn-primary's text color */}
      Add New
    </button>
  </div>
);

export default SearchAddBar;