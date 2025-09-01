import { useState } from 'react';
import { LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ui/ThemeToggle';

export function Navbar({ authed, onAuthOpen, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center" aria-hidden>
            <span className="text-white font-bold">CR</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 hidden sm:inline-block">Constitutional Rights Research</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:hidden">CR Research</span>
        </a>
        
        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button 
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {authed ? (
            <>
              <Button variant="secondary" onClick={onLogout} aria-label="Sign out">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </Button>
              <Button variant="ghost" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <Button onClick={onAuthOpen} aria-label="Sign in">
                <LogIn className="mr-2 h-4 w-4" /> Sign in / Create account
              </Button>
              <Button variant="ghost" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-slideDown">
          <div className="px-4 py-3 space-y-2">
            {authed ? (
              <>
                <Button variant="secondary" onClick={onLogout} className="w-full justify-center" aria-label="Sign out">
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
                <Button variant="ghost" className="w-full justify-center" aria-label="Account">
                  <User className="mr-2 h-4 w-4" /> My Account
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onAuthOpen} className="w-full justify-center" aria-label="Sign in">
                  <LogIn className="mr-2 h-4 w-4" /> Sign in / Create account
                </Button>
                <Button variant="ghost" className="w-full justify-center" aria-label="Account">
                  <User className="mr-2 h-4 w-4" /> Guest Account
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}