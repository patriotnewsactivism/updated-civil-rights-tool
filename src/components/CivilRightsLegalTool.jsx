// path: src/components/CivilRightsLegalTool.jsx
// Minimal, clean, Tailwind v3-compatible component for the app shell.
// Why: Provides a real implementation to replace the mojibaked LegalToolkit file.

import React, { useMemo, useState } from 'react';
import { Shield, Gavel, BookOpen, FileText, Users, User, Search } from 'lucide-react';

/**
 * CivilRightsLegalTool
 * - Navigation + placeholder routes to keep build green
 * - Tailwind classes only; no external styling assumptions
 */
export default function CivilRightsLegalTool() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [active, setActive] = useState('home');
  const [query, setQuery] = useState('');

  const navItems = useMemo(() => ([
    { id: 'home', label: 'Home', icon: <Shield className="h-5 w-5" /> },
    { id: 'cases', label: 'Case Explorer', icon: <Gavel className="h-5 w-5" /> },
    { id: 'resources', label: 'Legal Resources', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'upload', label: 'Upload Case', icon: <FileText className="h-5 w-5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <Users className="h-5 w-5" />, requiresAuth: true },
    { id: 'auth', label: isAuthenticated ? 'Sign Out' : 'Sign In', icon: <User className="h-5 w-5" /> }
  ]), [isAuthenticated]);

  const visibleNav = navItems.filter(i => (i.requiresAuth ? isAuthenticated : true));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-lg font-semibold">Civil Rights Legal Tool</h1>
          </div>
          <div className="relative hidden items-center md:flex">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-64 rounded-md border border-slate-200 py-1.5 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-100"
            onClick={() => setIsAuthenticated((v) => !v)}
            aria-label={isAuthenticated ? 'Sign out' : 'Sign in'}
          >
            {isAuthenticated ? 'Sign out' : 'Sign in'}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-12">
        <nav className="md:col-span-3">
          <ul className="space-y-1">
            {visibleNav.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActive(item.id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100 ${active === item.id ? 'bg-slate-100 font-medium' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className="md:col-span-9">
          <Section id="home" active={active} title="Welcome">
            <p className="text-sm text-slate-600">
              Use the navigation to explore cases, read resources, or upload documents.
            </p>
          </Section>

          <Section id="cases" active={active} title="Case Explorer">
            <Placeholder>Search, filter, and compare civil rights cases. (Coming soon)</Placeholder>
          </Section>

          <Section id="resources" active={active} title="Legal Resources">
            <Placeholder>FOIA templates, statutes, and practical guides. (Coming soon)</Placeholder>
          </Section>

          <Section id="upload" active={active} title="Upload Case">
            <div className="rounded-md border border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm text-slate-600">Drag & drop files here or click to upload.</p>
              <button className="mt-3 rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700">Choose file</button>
            </div>
          </Section>

          <Section id="dashboard" active={active} title="Dashboard">
            {isAuthenticated ? (
              <Placeholder>Analytics, saved searches, and recent activity. (Coming soon)</Placeholder>
            ) : (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                Sign in to see your dashboard.
              </div>
            )}
          </Section>

          <Section id="auth" active={active} title={isAuthenticated ? 'Account' : 'Sign In'}>
            {isAuthenticated ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                You are signed in.
              </div>
            ) : (
              <form className="max-w-sm space-y-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Email</span>
                  <input type="email" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Password</span>
                  <input type="password" className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" />
                </label>
                <button type="button" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700" onClick={() => setIsAuthenticated(true)}>Sign in</button>
              </form>
            )}
          </Section>
        </main>
      </div>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Civil Rights Legal Tool</span>
          <a href="#" className="hover:underline">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, active, title, children }){
  if (active !== id) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Placeholder({ children }){
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
      {children}
    </div>
  );
}
