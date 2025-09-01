#!/usr/bin/env bash
set -euo pipefail

# --- sanity checks
if [[ ! -f package.json ]]; then
  echo "package.json not found. Run this inside your CRA project root." >&2
  exit 1
fi

mkdir -p netlify/functions src/components/ui src/lib public scripts

# --- deps
npm i @netlify/gotrue-js lucide-react >/dev/null 2>&1 || npm i @netlify/gotrue-js lucide-react

# --- netlify.toml
cat > netlify.toml <<'EOF'
[build]
  command = "npm run build"
  publish = "build"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
EOF

# --- serverless search function (JS)
cat > netlify/functions/search.js <<'EOF'
/* CJS for compatibility */
const CL_ENDPOINT = 'https://www.courtlistener.com/api/rest/v3/search/';

exports.handler = async (event) => {
  try {
    const q = (event.queryStringParameters?.q || '').trim();
    const page = event.queryStringParameters?.page || '1';
    if (!q) return json(400, { error: "Missing required 'q' query parameter." });

    const url = new URL(CL_ENDPOINT);
    url.searchParams.set('q', q);
    url.searchParams.set('type', 'o');
    url.searchParams.set('order_by', 'score desc');
    url.searchParams.set('page', String(page));

    const res = await fetch(url.toString(), { headers: { 'User-Agent': 'civil-rights.netlify.app (Netlify Function)' } });
    if (!res.ok) return json(res.status, { error: 'Upstream error', details: (await res.text()).slice(0, 4000) });

    const data = await res.json();
    const items = (data?.results || []).map((r) => ({
      id: r.id,
      caseName: r.caseName || r.caseNameShort || r.caption || 'Untitled',
      citation: r.citation || (r.citesTo?.[0]?.cite || null),
      court: r.court_citation || r.court || r.court_str || null,
      date: r.dateFiled || r.dateArgued || r.dateModified || null,
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : null,
      snippet: r.snippet || null,
    }));

    return json(200, { items, raw: { count: data.count, next: data.next, previous: data.previous } });
  } catch (err) {
    return json(500, { error: 'Unexpected error', details: String(err?.message || err) });
  }
};

function json(statusCode, body) {
  return { statusCode, body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } };
}
EOF

# --- Identity widget
if [[ -f public/index.html ]] && ! grep -q 'identity.netlify.com' public/index.html; then
  # Insert before </head>
  tmpfile=$(mktemp)
  awk '{print} /<\/head>/ && !x {print "    <script src=\"https://identity.netlify.com/v1/netlify-identity-widget.js\"></script>"; x=1}' public/index.html >"$tmpfile"
  mv "$tmpfile" public/index.html
  echo "Added Netlify Identity widget to public/index.html"
fi

# --- lib
cat > src/lib/auth.js <<'EOF'
import GoTrue from '@netlify/gotrue-js';
export const auth = new GoTrue({ APIUrl: `${window.location.origin}/.netlify/identity`, setCookie: true });
export async function identityEnabled() {
  try { const res = await fetch('/.netlify/identity/settings', { cache: 'no-store' }); return res.ok; } catch { return false; }
}
export async function getCurrentUser() { try { const u = auth.currentUser(); return u ? { email: u.email || '' } : null; } catch { return null; } }
EOF

cat > src/lib/utils.js <<'EOF'
export function cn(...classes) { return classes.filter(Boolean).join(' '); }
EOF

# --- UI primitives
cat > src/components/ui/button.jsx <<'EOF'
import { cn } from '../../lib/utils';
export function Button({ className, variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = variant === 'primary' ? 'bg-brand-600 text-white hover:bg-brand-700' : variant === 'secondary' ? 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50' : 'text-gray-700 hover:bg-gray-100';
  return <button className={cn(base, styles, className)} {...props} />;
}
EOF

cat > src/components/ui/input.jsx <<'EOF'
import { cn } from '../../lib/utils';
export function Input({ className, ...props }) {
  return (
    <input className={cn('w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2', className)} {...props} />
  );
}
EOF

cat > src/components/ui/card.jsx <<'EOF'
import { cn } from '../../lib/utils';
export function Card({ className, ...props }) { return <div className={cn('rounded-2xl bg-white shadow-sm ring-1 ring-gray-200', className)} {...props} />; }
export function CardHeader({ className, ...props }) { return <div className={cn('p-4 border-b border-gray-100', className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn('p-4', className)} {...props} />; }
EOF

cat > src/components/ui/dialog.jsx <<'EOF'
import { useEffect } from 'react';
export function Dialog({ open, onClose, children }) {
  useEffect(() => { function onKey(e){ if(e.key==='Escape') onClose(); } if(open) document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey); }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200">{children}</div>
    </div>
  );
}
EOF

cat > src/components/ui/label.jsx <<'EOF'
import { cn } from '../../lib/utils';
export function Label({ className, ...props }) { return <label className={cn('mb-1 block text-sm font-medium text-gray-700', className)} {...props} />; }
EOF

# --- components
cat > src/components/Navbar.jsx <<'EOF'
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
EOF

cat > src/components/AuthModal.jsx <<'EOF'
import { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { auth } from '../lib/auth';
export function AuthModal({ open, onClose, onAuthed }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function handleSubmit(e){ e.preventDefault(); setLoading(true); setError(null); try { if(mode==='signup'){ await auth.signup(email, password); } else { await auth.login(email, password, true); } onAuthed(); onClose(); } catch(err){ setError(err?.json?.error_description || err?.message || 'Authentication failed'); } finally { setLoading(false);} }
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{mode==='signup'?'Create account':'Sign in'}</h2>
        <button className="text-sm text-brand-600 hover:underline" onClick={()=>setMode(mode==='signup'?'signin':'signup')}>
          {mode==='signup'?'Have an account? Sign in':'New here? Create one'}
        </button>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{String(error)}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading?'Please wait…':(mode==='signup'?'Create account':'Sign in')}</Button>
      </form>
    </Dialog>
  );
}
EOF

cat > src/components/CaseCard.jsx <<'EOF'
import { Card, CardContent, CardHeader } from './ui/card';
export function CaseCard({ item }){
  return (
    <Card className="hover:shadow-md transition">
      <CardHeader>
        <a href={item.url || undefined} target="_blank" rel="noreferrer" className="text-base font-semibold text-brand-700 hover:underline">{item.caseName}</a>
        <div className="mt-1 text-xs text-gray-500 space-x-2">
          {item.citation && <span>{item.citation}</span>}
          {item.court && <span>• {item.court}</span>}
          {item.date && <span>• {new Date(item.date).toLocaleDateString()}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-3">{item.snippet || 'No summary available.'}</p>
      </CardContent>
    </Card>
  );
}
EOF

cat > src/components/Search.jsx <<'EOF'
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CaseCard } from './CaseCard';
export function Search(){
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function runSearch(query){
    if(!query.trim()){ setItems([]); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if(!res.ok) throw new Error(data?.error || 'Search failed');
      setItems(data.items || []);
    } catch(err){ setError(err.message || String(err)); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ const id=setTimeout(()=>runSearch(q), 350); return ()=>clearTimeout(id); }, [q]);
  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-4">
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search civil rights opinions, e.g., 'first amendment'…" aria-label="Search cases" />
          <Button onClick={()=>runSearch(q)} disabled={loading}>Search</Button>
        </div>
        {loading && <p className="mt-3 text-sm text-gray-600">Searching…</p>}
        {error && <p className="mt-3 text-sm text-red-600" role="alert">{String(error)}</p>}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((it)=> <CaseCard key={String(it.id)} item={it} />)}
      </div>
      {!loading && !error && items.length===0 && q && <p className="mt-6 text-sm text-gray-600">No results. Try different keywords.</p>}
    </section>
  );
}
EOF

# --- Tailwind (install if missing)
if [[ ! -f tailwind.config.js && ! -f tailwind.config.cjs && ! -f tailwind.config.ts ]]; then
  npm i -D tailwindcss postcss autoprefixer >/dev/null 2>&1 || npm i -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p >/dev/null 2>&1 || true
fi

# ensure index.css contains Tailwind directives
mkdir -p src
if [[ -f src/index.css ]]; then
  if ! grep -q '@tailwind base' src/index.css; then
    cp src/index.css src/index.css.bak
    cat > src/index.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
:root { color-scheme: light; }
EOF
  fi
else
  cat > src/index.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
:root { color-scheme: light; }
EOF
fi

# --- Attempt to wire into App.js (non-destructive fallback)
if [[ -f src/App.js ]]; then
  if grep -q 'learn react' src/App.js; then
    # replace default CRA App with our layout
    cat > src/App.js <<'EOF'
import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Search } from './components/Search';
import { AuthModal } from './components/AuthModal';
import { auth, getCurrentUser, identityEnabled } from './lib/auth';
import './index.css';

export default function App(){
  const [authed, setAuthed] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [idEnabled, setIdEnabled] = useState(null);
  useEffect(()=>{ (async ()=>{ setIdEnabled(await identityEnabled()); setAuthed(!!(await getCurrentUser())); })(); }, []);
  async function handleLogout(){ try { await auth.logout(); setAuthed(false);} catch(e){ console.error(e);} }
  return (
    <div>
      <Navbar authed={authed} onAuthOpen={()=>setAuthOpen(true)} onLogout={handleLogout} />
      <main>
        <section className="bg-gradient-to-b from-brand-50 to-transparent">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Search U.S. civil rights case law</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">Fast, public search across court opinions. Create an account to keep your findings.</p>
          </div>
        </section>
        {idEnabled===false && (
          <div className="mx-auto mt-6 max-w-6xl px-4">
            <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">Identity is not enabled on this site. Enable Identity in Netlify to allow account creation.</div>
          </div>
        )}
        <Search />
      </main>
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)} onAuthed={()=>setAuthed(true)} />
      <footer className="mt-12 border-t border-gray-200 py-8 text-center text-xs text-gray-500">Built for research & education. Sources via CourtListener.</footer>
    </div>
  );
}
EOF
    echo "Updated src/App.js with app shell."
  else
    echo "**Manual step:** Import and render <Search /> somewhere in your UI."
  fi
fi

cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: { colors: { brand: { 50:'#eef2ff',100:'#e0e7ff',500:'#6366f1',600:'#4f46e5',700:'#4338ca' } } } },
  plugins: [],
};
EOF

cat > postcss.config.js <<'EOF'
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
EOF

echo "
✅ Applied: function, UI, auth, Tailwind.
Next: netlify dev  (for local)  or  git push (for deploy)."
EOF

chmod +x scripts/apply-cra.sh