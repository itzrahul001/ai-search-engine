import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-float">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></span>
          AI-Powered Personalization
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          <span className="text-white">Search Smarter</span>
          <br />
          <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-300% animate-gradient bg-clip-text text-transparent">
            With Intelligence
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Experience search results tailored to your interests, powered by advanced
          machine learning and sentence embeddings. Your search, personalized.
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to={user ? '/search' : '/register'}
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold text-lg rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-105"
          >
            <span className="relative z-10">
              {user ? 'Start Searching' : 'Get Started'}
            </span>
          </Link>

          {!user && (
            <Link
              to="/login"
              className="px-8 py-4 text-dark-300 hover:text-white font-semibold text-lg rounded-xl border border-dark-600 hover:border-dark-400 transition-all hover:bg-dark-800/50"
            >
              Sign In →
            </Link>
          )}
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🎯', title: 'Personalized', desc: 'Results ranked by your interests and behavior' },
            { icon: '🧠', title: 'ML-Powered', desc: 'Sentence embeddings for semantic understanding' },
            { icon: '⚡', title: 'Persona Modes', desc: 'Student, Work, or Casual search contexts' },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-dark-800/40 backdrop-blur-sm border border-dark-700/50 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-dark-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
