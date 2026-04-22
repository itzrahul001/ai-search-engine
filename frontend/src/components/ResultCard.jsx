import React, { useState } from 'react';
import api from '../services/api';

const ResultCard = ({ result, index }) => {
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [saved, setSaved] = useState(false);

  const score = result.personalizedScore || 0;
  const scoreColor = score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-dark-400';

  const handleFeedback = async (type) => {
    try {
      await api.post('/search/feedback', { resultId: result.id, feedback: type });
      setFeedbackGiven(type);
    } catch (err) {
      console.error('Feedback failed:', err);
    }
  };

  const handleSave = async () => {
    try {
      await api.post('/user/save', {
        title: result.title,
        url: result.link,
        snippet: result.snippet,
        topicTag: '',
      });
      setSaved(true);
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  return (
    <div
      className="group relative bg-dark-800/60 backdrop-blur-sm rounded-xl border border-dark-700/50 p-5 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Score badge */}
      {score > 0 && (
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/80 border border-dark-600/50 ${scoreColor}`}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold">{score}%</span>
          </div>
        </div>
      )}

      {/* Title */}
      <a
        href={result.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-lg font-semibold text-primary-400 hover:text-primary-300 transition-colors line-clamp-2"
      >
        {result.title}
      </a>

      {/* URL */}
      <p className="mt-1 text-sm text-emerald-400/70 truncate">{result.link}</p>

      {/* Snippet */}
      <p className="mt-2 text-sm text-dark-300 leading-relaxed line-clamp-3">{result.snippet}</p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleFeedback('positive')}
          disabled={feedbackGiven !== null}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            feedbackGiven === 'positive'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-dark-700/80 text-dark-300 hover:bg-emerald-500/10 hover:text-emerald-400 border border-dark-600/50'
          }`}
        >
          👍 Helpful
        </button>
        <button
          onClick={() => handleFeedback('negative')}
          disabled={feedbackGiven !== null}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            feedbackGiven === 'negative'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-dark-700/80 text-dark-300 hover:bg-red-500/10 hover:text-red-400 border border-dark-600/50'
          }`}
        >
          👎 Not useful
        </button>
        <button
          onClick={handleSave}
          disabled={saved}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ml-auto ${
            saved
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'bg-dark-700/80 text-dark-300 hover:bg-primary-500/10 hover:text-primary-400 border border-dark-600/50'
          }`}
        >
          {saved ? '✓ Saved' : '⭐ Save'}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
