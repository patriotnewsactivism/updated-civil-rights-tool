// src/App.tsx
import * as React from "react";
import { Navbar } from "./components/Navbar";
import { Search } from "./components/Search";
import { AuthModal } from "./components/AuthModal";
import { auth, getCurrentUser, identityEnabled } from "./lib/auth";

export default function App() {
  const [authed, setAuthed] = React.useState(false);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [idEnabled, setIdEnabled] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    void (async () => {
      setIdEnabled(await identityEnabled());
      setAuthed(!!(await getCurrentUser()));
    })();
  }, []);

  async function handleLogout() {
    try {
      await auth.logout();
      setAuthed(false);
    } catch (e) {
      // why: avoid swallowing; UI is not critical here
      console.error(e);
    }
  }

  return (
    <div>
      <Navbar authed={authed} onAuthOpen={() => setAuthOpen(true)} onLogout={handleLogout} />

      <main>
        <Hero />
        {idEnabled === false && (
          <div className="mx-auto mt-6 max-w-6xl px-4">
            <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">
              Identity is not enabled on this site. Enable **Identity** in Netlify to allow account creation.
            </div>
          </div>
        )}
        <Search />
      </main>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuthed={() => setAuthed(true)} />

      <footer className="mt-12 border-t border-gray-200 py-8 text-center text-xs text-gray-500">
        Built for research & education. Sources via CourtListener.
      </footer>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-transparent">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Search U.S. civil rights case law</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Fast, public search across court opinions. Create an account to keep your findings.
        </p>
      </div>
    </section>
  );
}