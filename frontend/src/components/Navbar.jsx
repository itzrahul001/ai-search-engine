import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-dark-900/80 border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              AI Search
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/search"
                  className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
                >
                  Search
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
                >
                  Profile
                </Link>
                <div className="w-px h-6 bg-dark-700 mx-1"></div>
                <span className="text-sm text-dark-400">{user.fullName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors rounded-lg hover:bg-dark-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg hover:from-primary-500 hover:to-accent-500 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
