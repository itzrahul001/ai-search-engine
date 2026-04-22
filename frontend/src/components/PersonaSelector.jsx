import React from 'react';

const modes = [
  {
    id: 'student',
    label: 'Student',
    icon: '🎓',
    description: 'Academic & learning',
    gradient: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/25',
  },
  {
    id: 'work',
    label: 'Work',
    icon: '💼',
    description: 'Professional & business',
    gradient: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/25',
  },
  {
    id: 'casual',
    label: 'Casual',
    icon: '🎯',
    description: 'General browsing',
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/25',
  },
];

const PersonaSelector = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {modes.map((mode) => {
        const isActive = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              relative flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300
              ${
                isActive
                  ? `bg-gradient-to-r ${mode.gradient} text-white shadow-lg ${mode.shadow} scale-105`
                  : 'bg-dark-800/60 text-dark-300 border border-dark-700/50 hover:border-dark-500 hover:text-white hover:bg-dark-700/80'
              }
            `}
          >
            <span className="text-lg">{mode.icon}</span>
            <div className="text-left">
              <div className="font-semibold">{mode.label}</div>
              <div className={`text-xs ${isActive ? 'text-white/70' : 'text-dark-500'}`}>
                {mode.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PersonaSelector;
