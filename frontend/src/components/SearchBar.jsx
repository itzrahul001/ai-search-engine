import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        
        <div className="relative flex items-center bg-dark-800 rounded-2xl border border-dark-600/50 focus-within:border-primary-500/50 transition-all">
          {/* Search icon */}
          <div className="pl-5 pr-2">
            <svg className="w-5 h-5 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Input */}
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search the web with AI personalization..."
            className="flex-1 py-4 px-2 bg-transparent text-white placeholder-dark-400 text-lg focus:outline-none"
            disabled={loading}
          />

          {/* Search button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="mr-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-accent-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
