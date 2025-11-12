import React, { useState, useEffect } from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import authService from '../services/AuthService';

const Header = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userProfile = await authService.getUserProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#9b7bb5] to-[#d2c5e7] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Operator 360</h1>
              <p className="text-xs text-white/80">Anomaly Detection System</p>
            </div>
          </div>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-all duration-300"
              >
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold">
                    {user.name || user.preferred_username || 'User'}
                  </p>
                  {user.email && (
                    <p className="text-xs text-white/80">{user.email}</p>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || user.preferred_username || 'User'}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-600 mt-1">{user.email}</p>
                    )}
                    {user.sub && (
                      <p className="text-xs text-gray-500 mt-1">ID: {user.sub}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;
