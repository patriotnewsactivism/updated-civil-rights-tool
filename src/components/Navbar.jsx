import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
export function Navbar({ authed, onAuthOpen, onLogout }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-brand-600" aria-hidden />
          <span className="text-sm font-semibold text-gray-900">Constitutional Rights Research</span>
        </a>
        <div className="flex items-center gap-2">
          {authed ? (
            <Button variant="secondary" onClick={onLogout} aria-label="Sign out">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          ) : (
            <Button onClick={onAuthOpen} aria-label="Sign in">
              <LogIn className="mr-2 h-4 w-4" /> Sign in / Create account
            </Button>
          )}
          <Button variant="ghost" aria-label="Account">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
