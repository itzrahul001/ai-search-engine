import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.register(fullName, email, password);
      login(data.token, {
        userId: data.userId,
        email: data.email,
        fullName: data.fullName,
      });
      navigate('/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl blur opacity-10"></div>
          <div className="relative bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-dark-700/50 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center shadow-lg shadow-accent-500/25">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-dark-400 text-sm mt-1">Join AI Search for personalized results</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Full Name</label>
                <input
                  id="register-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600/50 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/25 transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600/50 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/25 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">Password</label>
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-900/50 border border-dark-600/50 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/25 transition-all"
                  placeholder="Min 6 characters"
                  minLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-accent-600 to-primary-600 text-white font-semibold rounded-xl hover:from-accent-500 hover:to-primary-500 disabled:opacity-50 transition-all shadow-lg shadow-accent-500/20"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-400 hover:text-accent-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
