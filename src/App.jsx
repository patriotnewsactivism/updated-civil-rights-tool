import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Search } from './components/Search';
import { AuthModal } from './components/AuthModal';
import { auth, getCurrentUser, identityEnabled } from './lib/auth';
import { useTheme } from './context/ThemeContext';
import { useToast } from './context/ToastContext';
import './index.css';

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [idEnabled, setIdEnabled] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const toast = useToast();
  
  // Check authentication status and identity service availability on mount
  useEffect(() => { 
    async function initializeAuth() {
      try {
        // Check if identity service is enabled
        const identityStatus = await identityEnabled();
        setIdEnabled(identityStatus);
        
        // Check if user is already authenticated
        const user = await getCurrentUser();
        if (user) {
          setAuthed(true);
          toast.success(`Welcome back, ${user.email}`);
        }
      } catch (error) {
        console.error("Authentication initialization error:", error);
        toast.error("Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    }
    
    initializeAuth();
  }, [toast]);
  
  // Handle user logout
  async function handleLogout() { 
    try { 
      await auth.logout(); 
      setAuthed(false);
      toast.info("You have been signed out");
    } catch (e) { 
      console.error("Logout error:", e);
      toast.error("Failed to sign out");
    }
  }
  
  // Handle successful authentication
  function handleSuccessfulAuth() {
    setAuthed(true);
    setAuthOpen(false);
    toast.success("Successfully signed in");
  }
  
  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 ${theme}`}>
      <Navbar 
        authed={authed} 
        onAuthOpen={() => setAuthOpen(true)} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-brand-50 to-transparent dark:from-gray-800 dark:to-transparent">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 sm:text-3xl">
              Search U.S. civil rights case law
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
              Fast, public search across court opinions. Create an account to keep your findings.
            </p>
          </div>
        </section>
        
        {loading ? (
          <div className="mx-auto mt-6 max-w-6xl px-4">
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-600 dark:text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading application...
              </div>
            </div>
          </div>
        ) : (
          <>
            {idEnabled === false && (
              <div className="mx-auto mt-6 max-w-6xl px-4">
                <div className="rounded-2xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30 p-4 text-sm text-yellow-900 dark:text-yellow-200">
                  Identity is not enabled on this site. Enable Identity in Netlify to allow account creation.
                </div>
              </div>
            )}
            
            <Search />
          </>
        )}
      </main>
      
      <AuthModal 
        open={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onAuthed={handleSuccessfulAuth} 
      />
      
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 py-8 text-center text-xs text-gray-500 dark:text-gray-400">
        <div className="mx-auto max-w-6xl px-4">
          <p>Built for research & education. Sources via CourtListener.</p>
          <p className="mt-2">© {new Date().getFullYear()} Constitutional Rights Research</p>
        </div>
      </footer>
    </div>
  );
}