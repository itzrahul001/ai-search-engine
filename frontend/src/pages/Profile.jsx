import React, { useState, useEffect } from 'react';
import InterestPicker from '../components/InterestPicker';
import PersonaSelector from '../components/PersonaSelector';
import api from '../services/api';

const Profile = () => {
  const [interests, setInterests] = useState([]);
  const [activeMode, setActiveMode] = useState('student');
  const [savedResults, setSavedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchSavedResults();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      const data = response.data;
      const parsed = typeof data.interests === 'string' ? JSON.parse(data.interests) : data.interests;
      setInterests(Array.isArray(parsed) ? parsed : []);
      setActiveMode(data.activeMode || 'student');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedResults = async () => {
    try {
      const response = await api.get('/user/saved');
      setSavedResults(response.data || []);
    } catch (err) {
      console.error('Failed to fetch saved results:', err);
    }
  };

  const handleToggleInterest = (topicId) => {
    setInterests((prev) =>
      prev.includes(topicId) ? prev.filter((i) => i !== topicId) : [...prev, topicId]
    );
  };

  const handleSaveInterests = async () => {
    setSaving(true);
    try {
      await api.put('/user/interests', { interests: JSON.stringify(interests) });
      setMessage('Interests saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save interests.');
    } finally {
      setSaving(false);
    }
  };

  const handleModeChange = async (mode) => {
    setActiveMode(mode);
    try {
      await api.put('/user/mode', { mode });
    } catch (err) {
      console.error('Failed to update mode:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-dark-700 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <p className="text-dark-400 mt-1">Customize your search experience</p>
        </div>

        {/* Success message */}
        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center animate-pulse">
            {message}
          </div>
        )}

        {/* Persona Mode Section */}
        <section className="bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-dark-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-1">Persona Mode</h2>
          <p className="text-dark-400 text-sm mb-5">Choose your current search context</p>
          <PersonaSelector activeMode={activeMode} onModeChange={handleModeChange} />
        </section>

        {/* Interests Section */}
        <section className="bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-dark-700/50 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">Your Interests</h2>
              <p className="text-dark-400 text-sm mt-1">
                Select topics to personalize your results ({interests.length} selected)
              </p>
            </div>
            <button
              onClick={handleSaveInterests}
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 transition-all shadow-lg shadow-primary-500/20"
            >
              {saving ? 'Saving...' : 'Save Interests'}
            </button>
          </div>
          <InterestPicker selectedInterests={interests} onToggle={handleToggleInterest} />
        </section>

        {/* Saved Results Section */}
        <section className="bg-dark-800/60 backdrop-blur-sm rounded-2xl border border-dark-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-1">Saved Results</h2>
          <p className="text-dark-400 text-sm mb-5">Your bookmarked search results</p>

          {savedResults.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-dark-400">No saved results yet. Save results from your searches!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 rounded-xl bg-dark-900/50 border border-dark-600/30 hover:border-primary-500/30 transition-all"
                >
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 font-medium"
                  >
                    {result.title || result.url}
                  </a>
                  {result.snippet && (
                    <p className="text-dark-400 text-sm mt-1 line-clamp-2">{result.snippet}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {result.topicTag && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                        {result.topicTag}
                      </span>
                    )}
                    <span className="text-xs text-dark-500">{new Date(result.savedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
