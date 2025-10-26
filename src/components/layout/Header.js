import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Scale, 
  Search, 
  Upload, 
  Tool, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Settings 
} from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <header className="bg-dark-800/80 backdrop-blur-lg border-b border-primary-700/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Scale className="h-8 w-8 text-primary-400" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                <span className="text-primary-400">Constitutional</span> Rights
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Research Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link flex items-center space-x-2 ${isActive('/') ? 'text-primary-400' : 'text-gray-300 hover:text-primary-300'}`}
            >
              <Scale className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/search" 
              className={`nav-link flex items-center space-x-2 ${isActive('/search') ? 'text-primary-400' : 'text-gray-300 hover:text-primary-300'}`}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
            <Link 
              to="/case/upload" 
              className={`nav-link flex items-center space-x-2 ${isActive('/case/upload') ? 'text-primary-400' : 'text-gray-300 hover:text-primary-300'}`}
            >
              <Upload className="h-4 w-4" />
              <span>Add Case</span>
            </Link>
            <Link 
              to="/toolkit" 
              className={`nav-link flex items-center space-x-2 ${isActive('/toolkit') ? 'text-primary-400' : 'text-gray-300 hover:text-primary-300'}`}
            >
              <Tool className="h-4 w-4" />
              <span>Toolkit</span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-dark-700 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-blue-400" />
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-dark-700 transition-colors">
                  <User className="h-5 w-5 text-primary-400" />
                  <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-primary-700/30 rounded-lg shadow-lg overflow-hidden transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all origin-top-right">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary-900/50 hover:text-white">
                      Profile
                    </Link>
                    <Link to="/subscription" className="block px-4 py-2 text-sm text-gray-300 hover:bg-primary-900/50 hover:text-white">
                      Subscription
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-primary-900/50 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-700"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden mt-4 py-4 border-t border-dark-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/') ? 'bg-primary-900/50 text-primary-400' : 'text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Scale className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link 
                to="/search" 
                className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/search') ? 'bg-primary-900/50 text-primary-400' : 'text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </Link>
              <Link 
                to="/case/upload" 
                className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/case/upload') ? 'bg-primary-900/50 text-primary-400' : 'text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Upload className="h-5 w-5" />
                <span>Add Case</span>
              </Link>
              <Link 
                to="/toolkit" 
                className={`flex items-center space-x-3 p-2 rounded-md ${isActive('/toolkit') ? 'bg-primary-900/50 text-primary-400' : 'text-gray-300'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Tool className="h-5 w-5" />
                <span>Toolkit</span>
              </Link>

              <div className="pt-4 border-t border-dark-700">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-3 p-2 rounded-md text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      to="/subscription" 
                      className="flex items-center space-x-3 p-2 rounded-md text-gray-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Subscription</span>
                    </Link>
                    <button 
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-2 rounded-md text-gray-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-3 p-2 rounded-md bg-primary-600 text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                )}

                <button 
                  onClick={() => {
                    toggleDarkMode();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-4 w-full flex items-center justify-center space-x-3 p-2 rounded-md bg-dark-700 text-gray-300"
                >
                  {darkMode ? (
                    <>
                      <Sun className="h-5 w-5 text-yellow-400" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 text-blue-400" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;