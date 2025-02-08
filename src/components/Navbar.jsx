import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X,
  Sparkles,
  Users
} from 'lucide-react';

function Navbar() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="relative z-50">
      {/* Dark themed background */}
      <div className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="container mx-auto px-4">
          {/* Language selector */}
          <div className="flex justify-end py-1 text-sm">
            <select className="bg-[#1a1a1a] text-gray-300 text-sm focus:outline-none cursor-pointer">
              <option>English</option>
              <option>日本語</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-[#1a1a1a] sticky top-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 z-50">
              <BookOpen className="w-7 h-7 text-yellow-500" />
              <span className="text-xl font-bold text-white tracking-wider hidden sm:inline">
                TOBI<span className="text-yellow-500">MANGA</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/updates" className="nav-link">
                <Clock className="w-5 h-5" />
                <span>UPDATES</span>
              </Link>
              <Link to="/featured" className="nav-link">
                <Sparkles className="w-5 h-5" />
                <span>FEATURED</span>
              </Link>
              <Link to="/rankings" className="nav-link">
                <Star className="w-5 h-5" />
                <span>RANKING</span>
              </Link>
              <Link to="/manga" className="nav-link">
                <BookOpen className="w-5 h-5" />
                <span>MANGA</span>
              </Link>
              <Link to="/creators" className="nav-link">
                <Users className="w-5 h-5" />
                <span>CREATORS</span>
              </Link>

              {/* Search Bar */}
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  className="bg-[#2a2a2a] text-white pl-10 pr-4 py-2 rounded w-64 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 placeholder-gray-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/favorites" className="nav-link">
                    <Heart className="w-5 h-5" />
                    <span>FAVORITED</span>
                  </Link>
                  <button 
                    onClick={signOut}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded text-sm font-bold transition-colors"
                  >
                    LOGOUT
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded text-sm font-bold transition-colors"
                >
                  LOGIN
                </Link>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="flex items-center space-x-4 md:hidden">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <Search className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-400 hover:text-white"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`
          md:hidden bg-[#1a1a1a] border-t border-gray-800 transition-all duration-300
          ${isSearchOpen ? 'max-h-16 py-3 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}
        `}>
          <div className="container mx-auto px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search manga..."
                className="w-full bg-[#2a2a2a] text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500/50 placeholder-gray-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`
          fixed inset-0 bg-black/95 backdrop-blur-sm transition-all duration-300 md:hidden
          ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}>
          <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col space-y-6">
              <Link 
                to="/updates" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <Clock className="w-6 h-6" />
                <span>UPDATES</span>
              </Link>
              <Link 
                to="/featured" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <Sparkles className="w-6 h-6" />
                <span>FEATURED</span>
              </Link>
              <Link 
                to="/rankings" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="w-6 h-6" />
                <span>RANKING</span>
              </Link>
              <Link 
                to="/manga" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-6 h-6" />
                <span>MANGA</span>
              </Link>
              <Link 
                to="/creators" 
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="w-6 h-6" />
                <span>CREATORS</span>
              </Link>
              {user ? (
                <>
                  <Link 
                    to="/favorites" 
                    className="mobile-nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Heart className="w-6 h-6" />
                    <span>FAVORITED</span>
                  </Link>
                  <button 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="mobile-nav-link"
                  >
                    <User className="w-6 h-6" />
                    <span>LOGOUT</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="mobile-nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-6 h-6" />
                  <span>LOGIN</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;