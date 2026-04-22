import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ResultCard from '../components/ResultCard';
import PersonaSelector from '../components/PersonaSelector';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [persona, setPersona] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const response = await api.get('/search', {
        params: { query: searchQuery, mode: persona },
      });
      setResults(response.data.results || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    setPersona(mode);
    // Re-search with new mode if we have a query
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AI Search
            </span>
          </h1>
          <p className="text-dark-400 text-sm">Results personalized just for you</p>
        </div>

        {/* Persona Selector */}
        <div className="mb-6">
          <PersonaSelector activeMode={persona} onModeChange={handleModeChange} />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-dark-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-dark-400">Searching and personalizing results...</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-dark-400">
                <span className="text-white font-semibold">{results.length}</span> results for{' '}
                <span className="text-primary-400">"{query}"</span>
              </p>
            </div>
            {results.map((result, index) => (
              <ResultCard key={index} result={result} index={index} />
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-dark-400">Try a different search query or change your persona mode.</p>
          </div>
        )}

        {/* Empty state */}
        {!searched && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-float">✨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready to search</h3>
            <p className="text-dark-400">Enter a query above to get AI-personalized results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
