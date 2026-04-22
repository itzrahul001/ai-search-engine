import React from 'react';

const topics = [
  { id: 'Technology', icon: '💻', color: 'from-blue-500 to-indigo-500' },
  { id: 'AI', icon: '🤖', color: 'from-violet-500 to-purple-500' },
  { id: 'Sports', icon: '⚽', color: 'from-green-500 to-emerald-500' },
  { id: 'Finance', icon: '📈', color: 'from-amber-500 to-yellow-500' },
  { id: 'Health', icon: '🏥', color: 'from-red-500 to-pink-500' },
  { id: 'Science', icon: '🔬', color: 'from-cyan-500 to-teal-500' },
  { id: 'Politics', icon: '🏛️', color: 'from-slate-400 to-slate-500' },
  { id: 'Entertainment', icon: '🎬', color: 'from-fuchsia-500 to-pink-500' },
  { id: 'Travel', icon: '✈️', color: 'from-sky-500 to-blue-500' },
  { id: 'Food', icon: '🍕', color: 'from-orange-500 to-red-500' },
];

const InterestPicker = ({ selectedInterests, onToggle }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {topics.map((topic) => {
        const isSelected = selectedInterests.includes(topic.id);
        return (
          <button
            key={topic.id}
            onClick={() => onToggle(topic.id)}
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-xl font-medium text-sm transition-all duration-300
              ${
                isSelected
                  ? `bg-gradient-to-br ${topic.color} text-white shadow-lg scale-105`
                  : 'bg-dark-800/60 text-dark-300 border border-dark-700/50 hover:border-dark-500 hover:text-white hover:scale-102'
              }
            `}
          >
            <span className="text-2xl">{topic.icon}</span>
            <span className={isSelected ? 'font-semibold' : ''}>{topic.id}</span>
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default InterestPicker;
