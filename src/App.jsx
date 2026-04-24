import React, { useState, useEffect, useRef } from 'react';
import {
  Scale, Search, BookOpen, FileText, Users, User,
  Menu, X, ChevronRight, Shield, Gavel, AlertTriangle,
  Radio, Video, MapPin, FileSearch, Activity, ArrowRight,
  Camera, Wifi, WifiOff
} from 'lucide-react';

// ─── Live Ticker Data ─────────────────────────────────────────────
const TICKER_ITEMS = [
  '🔴 12 reports filed in last 24h',
  '📋 47 active FOIA requests',
  '⚖️ 3 court hearings scheduled tomorrow',
  '🛡️ 2 new 1st Amendment violations documented',
  '📡 Live stream active: Dallas, TX',
  '🔴 8 new officer misconduct reports this week',
  '📜 14th Amendment case update: 5th Circuit',
  '🚨 Emergency legal aid request: Chicago, IL',
  '📊 289 constitutional violations tracked this month',
];

// ─── Ticker Component ──────────────────────────────────────────────
const LiveTicker = () => {
  const text = TICKER_ITEMS.join('   ·   ');

  return (
    <div className="bg-[#0d0d0d] border-b border-red-900/40 overflow-hidden h-9 flex items-center">
      <div className="flex-shrink-0 bg-red-700 text-white text-[10px] font-bold tracking-widest uppercase px-3 h-full flex items-center z-10">
        LIVE
      </div>
      <div className="relative overflow-hidden flex-1">
        <div className="ticker-scroll whitespace-nowrap text-[12px] text-gray-400 font-inter-tight">
          {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
    </div>
  );
};

// ─── Animated Map Hero Background ─────────────────────────────────
const MapDots = () => {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() > 0.7 ? 'large' : 'small',
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(220,38,38,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* USA rough outline suggestion via gradient blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[30%] left-[15%] w-[70%] h-[50%] rounded-[40%] bg-gradient-radial from-red-900 to-transparent blur-3xl" />
      </div>
      {/* Pulsing incident dots */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        >
          {dot.size === 'large' ? (
            <>
              <div
                className="w-2 h-2 rounded-full bg-red-500"
                style={{ animation: `pulseGlow ${2 + dot.delay * 0.3}s ease-in-out infinite`, animationDelay: `${dot.delay}s` }}
              />
              <div
                className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 opacity-40"
                style={{ animation: `ripple ${2 + dot.delay * 0.3}s ease-out infinite`, animationDelay: `${dot.delay}s` }}
              />
            </>
          ) : (
            <div
              className="w-1 h-1 rounded-full bg-red-700 opacity-60"
              style={{ animation: `blink ${3 + dot.delay}s ease-in-out infinite`, animationDelay: `${dot.delay}s` }}
            />
          )}
        </div>
      ))}
      {/* Connecting lines suggestion */}
      <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
        <line x1="20%" y1="40%" x2="45%" y2="35%" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="45%" y1="35%" x2="70%" y2="45%" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="30%" y1="60%" x2="55%" y2="55%" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="55%" y1="55%" x2="80%" y2="50%" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};

// ─── Amendment Cards ───────────────────────────────────────────────
const AMENDMENTS = [
  { num: '1st', label: 'Speech & Assembly', short: 'Free speech, press, religion, assembly, petition', color: 'from-blue-900/60' },
  { num: '4th', label: 'Search & Seizure', short: 'Protection from unreasonable searches', color: 'from-purple-900/60' },
  { num: '5th', label: 'Due Process', short: 'Self-incrimination & double jeopardy protection', color: 'from-amber-900/60' },
  { num: '6th', label: 'Fair Trial', short: 'Right to counsel & speedy public trial', color: 'from-teal-900/60' },
  { num: '8th', label: 'Cruel Punishment', short: 'Prohibits excessive bail and cruel punishment', color: 'from-rose-900/60' },
  { num: '10th', label: "States' Rights", short: "Powers reserved to states or the people", color: 'from-indigo-900/60' },
  { num: '14th', label: 'Equal Protection', short: 'Citizenship, due process & equal protection', color: 'from-green-900/60' },
];

// ─── Main App ──────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'search', label: 'Search Cases', icon: Search },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'livestream', label: 'Live', icon: Radio },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'upload', label: 'Upload', icon: FileText },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100" style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}>

      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&display=swap');

        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-ui { font-family: 'Inter Tight', 'Inter', sans-serif; }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll {
          display: inline-block;
          animation: ticker 32s linear infinite;
        }
        .ticker-scroll:hover { animation-play-state: paused; }

        @keyframes pulseGlow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.1; }
        }
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-animate { animation: heroFade 0.9s ease forwards; }
        .hero-animate-2 { animation: heroFade 0.9s 0.2s ease forwards; opacity: 0; }
        .hero-animate-3 { animation: heroFade 0.9s 0.4s ease forwards; opacity: 0; }

        .amendment-card:hover .amend-num { color: white; }
        .nav-link { transition: color 0.15s, border-color 0.15s; }

        /* Subtle noise texture overlay */
        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.025;
          pointer-events: none;
        }
      `}</style>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <button onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 group">
              <Scale className="h-5 w-5 text-red-500 group-hover:text-red-400 transition-colors" />
              <span className="font-display text-[17px] text-white tracking-tight">Civil Rights Hub</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`nav-link flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-ui font-medium transition-colors ${
                      activeTab === item.id
                        ? 'text-white bg-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                    {item.id === 'livestream' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAuthenticated(!isAuthenticated)}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-ui font-medium text-white border border-white/15 rounded hover:bg-white/10 transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                {isAuthenticated ? 'Account' : 'Sign In'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#0a0a0a]">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium ${
                      activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* ── HOME PAGE ── */}
      {activeTab === 'home' && (
        <main>
          {/* ── HERO ── */}
          <section className="noise relative min-h-[92vh] flex items-center overflow-hidden bg-[#080808]">
            <MapDots />

            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080808]/40 to-[#080808] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-[#080808]/40 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="max-w-3xl">
                {/* Eyebrow */}
                <div className="hero-animate flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-ui font-semibold tracking-[0.15em] uppercase text-red-400">
                    Live · Documenting America's Rights in Real Time
                  </span>
                </div>

                {/* Headline */}
                <h1 className="hero-animate-2 font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-8">
                  Your rights.<br />
                  <span className="italic text-red-400">Documented.</span><br />
                  Defended.
                </h1>

                {/* Sub */}
                <p className="hero-animate-3 font-ui text-lg text-gray-400 leading-relaxed mb-10 max-w-xl">
                  Report violations, track FOIA requests, access landmark case law, and livestream encounters — all in one platform built for citizens on the front lines.
                </p>

                {/* CTA row */}
                <div className="hero-animate-3 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="group flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 rounded font-ui font-semibold text-[15px] transition-all"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Report a Violation
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="flex items-center gap-2 text-gray-300 hover:text-white border border-white/15 hover:border-white/30 px-7 py-3.5 rounded font-ui font-medium text-[15px] transition-all"
                  >
                    <Search className="h-4 w-4" />
                    Search Case Law
                  </button>
                </div>

                {/* Stats row */}
                <div className="hero-animate-3 flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/8">
                  {[
                    { value: '2,847', label: 'Cases Documented' },
                    { value: '47', label: 'Active FOIAs' },
                    { value: '12', label: 'Reports Today' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="font-display text-3xl text-white">{stat.value}</div>
                      <div className="font-ui text-xs text-gray-500 uppercase tracking-widest mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
              <div className="w-px h-12 bg-white/40" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
            </div>
          </section>

          {/* ── PATH CHOOSER ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="mb-12">
              <p className="font-ui text-xs text-gray-500 uppercase tracking-widest mb-3">Choose Your Path</p>
              <h2 className="font-display text-4xl text-white">What brings you here?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: AlertTriangle,
                  title: 'I need to report a violation',
                  desc: 'Document an incident with evidence, timestamps, and location.',
                  tab: 'upload',
                  accent: 'text-red-400 border-red-900/40 hover:border-red-700/60',
                },
                {
                  icon: FileSearch,
                  title: 'I'm researching case law',
                  desc: 'Search thousands of civil rights opinions and precedents.',
                  tab: 'search',
                  accent: 'text-blue-400 border-blue-900/40 hover:border-blue-700/60',
                },
                {
                  icon: Radio,
                  title: 'I'm filming right now',
                  desc: 'Go live instantly. Video auto-saved and backed up securely.',
                  tab: 'livestream',
                  accent: 'text-rose-400 border-rose-900/40 hover:border-rose-700/60',
                },
                {
                  icon: Users,
                  title: 'I want to connect',
                  desc: 'Join the community of advocates, journalists, and attorneys.',
                  tab: 'community',
                  accent: 'text-emerald-400 border-emerald-900/40 hover:border-emerald-700/60',
                },
              ].map((path) => {
                const Icon = path.icon;
                return (
                  <button
                    key={path.tab}
                    onClick={() => setActiveTab(path.tab)}
                    className={`amendment-card group text-left p-6 rounded-xl border bg-white/[0.02] hover:bg-white/[0.05] transition-all ${path.accent}`}
                  >
                    <Icon className={`h-6 w-6 mb-4 ${path.accent.split(' ')[0]}`} />
                    <h3 className="font-ui font-semibold text-white text-[15px] mb-2 leading-snug">{path.title}</h3>
                    <p className="font-ui text-[13px] text-gray-500 leading-relaxed">{path.desc}</p>
                    <div className={`flex items-center gap-1 mt-4 text-xs font-medium ${path.accent.split(' ')[0]}`}>
                      Go <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── AMENDMENTS ── */}
          <section className="border-t border-white/5 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="font-ui text-xs text-gray-500 uppercase tracking-widest mb-3">Constitutional Protections</p>
                  <h2 className="font-display text-4xl text-white">Know your amendments</h2>
                </div>
                <button
                  onClick={() => setActiveTab('search')}
                  className="hidden sm:flex items-center gap-1 text-sm font-ui text-gray-400 hover:text-white transition-colors"
                >
                  Explore all case law <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {AMENDMENTS.map((am) => (
                  <button
                    key={am.num}
                    onClick={() => setActiveTab('search')}
                    className={`amendment-card group relative p-4 rounded-xl border border-white/8 bg-gradient-to-b ${am.color} to-transparent hover:border-white/20 transition-all text-left`}
                  >
                    <div className="amend-num font-display text-3xl text-gray-500 group-hover:text-white transition-colors mb-3">
                      {am.num}
                    </div>
                    <div className="font-ui text-[13px] font-semibold text-white mb-1">{am.label}</div>
                    <div className="font-ui text-[11px] text-gray-500 leading-relaxed">{am.short}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── EMERGENCY + LIVESTREAM CTA ── */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Emergency */}
              <div className="relative overflow-hidden rounded-2xl border border-red-900/50 bg-red-950/20 p-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
                <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="font-display text-3xl text-white mb-3">Under threat?</h3>
                <p className="font-ui text-gray-400 text-sm leading-relaxed mb-6">
                  If your rights are being violated right now — document everything. Our platform auto-saves your recordings to secure backup so evidence can't be deleted.
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded font-ui font-medium text-sm transition-colors"
                >
                  Start Emergency Report
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Livestream */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-4">
                  <Radio className="h-8 w-8 text-gray-300" />
                  <span className="flex items-center gap-1.5 text-xs font-ui font-semibold text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    AUTO-SAVED
                  </span>
                </div>
                <h3 className="font-display text-3xl text-white mb-3">Go live instantly</h3>
                <p className="font-ui text-gray-400 text-sm leading-relaxed mb-6">
                  Every livestream is automatically recorded and backed up to secure storage. Even if your device is seized, your footage is safe.
                </p>
                <button
                  onClick={() => setActiveTab('livestream')}
                  className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded font-ui font-medium text-sm transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  Start Livestream
                </button>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ── SEARCH PAGE ── */}
      {activeTab === 'search' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <p className="font-ui text-xs text-gray-500 uppercase tracking-widest mb-2">Case Law Database</p>
            <h2 className="font-display text-4xl text-white mb-6">Search Civil Rights Opinions</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opinions, amendments, violations…"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg font-ui text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-white text-black font-ui font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
          <div className="bg-white/[0.03] border border-white/8 rounded-xl p-8 text-center text-gray-500 font-ui">
            Full case law search with Supabase integration active — connect to load results.
          </div>
        </main>
      )}

      {/* ── COMMUNITY PAGE ── */}
      {activeTab === 'community' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <p className="font-ui text-xs text-gray-500 uppercase tracking-widest mb-2">Social Network</p>
            <h2 className="font-display text-4xl text-white mb-3">Community</h2>
            <p className="font-ui text-gray-400">Connect with advocates, journalists, and civil rights attorneys.</p>
          </div>
          <div className="space-y-4">
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-6 flex items-start gap-4">
              <Wifi className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-ui font-semibold text-amber-300 mb-1">Community features temporarily offline</div>
                <p className="font-ui text-sm text-gray-400">Social feed, messaging, and group connections are being rebuilt with end-to-end encryption. Coming back shortly.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── LIVESTREAM PAGE ── */}
      {activeTab === 'livestream' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <p className="font-ui text-xs text-gray-500 uppercase tracking-widest">Livestreaming</p>
              <span className="flex items-center gap-1 text-[10px] font-ui font-bold text-red-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Auto-Backup On
              </span>
            </div>
            <h2 className="font-display text-4xl text-white mb-3">Go Live</h2>
            <p className="font-ui text-gray-400">Every stream is automatically saved and backed up. Evidence is preserved even if your device is seized or connection drops.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
              <Radio className="h-6 w-6 text-red-400 mb-3" />
              <h3 className="font-ui font-semibold text-white mb-1">Live Broadcast</h3>
              <p className="font-ui text-sm text-gray-500 mb-4">Stream publicly to the platform. Viewers can witness and document in real time.</p>
              <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-ui text-sm font-medium transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Start Public Stream
              </button>
            </div>
            <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
              <Shield className="h-6 w-6 text-blue-400 mb-3" />
              <h3 className="font-ui font-semibold text-white mb-1">Private Secure Recording</h3>
              <p className="font-ui text-sm text-gray-500 mb-4">Record privately. Auto-uploaded to encrypted storage only you control.</p>
              <button className="flex items-center gap-2 border border-white/15 hover:bg-white/10 text-white px-4 py-2 rounded font-ui text-sm font-medium transition-colors">
                <Camera className="h-4 w-4" />
                Start Private Recording
              </button>
            </div>
          </div>

          <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-6 flex items-start gap-4">
            <WifiOff className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-ui font-semibold text-amber-300 mb-1">Streaming infrastructure reconnecting</div>
              <p className="font-ui text-sm text-gray-400">Live RTMP relay is being reconfigured. Recording and backup are active. Contact support for manual upload links.</p>
            </div>
          </div>
        </main>
      )}

      {/* ── RESOURCES PAGE ── */}
      {activeTab === 'resources' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <p className="font-ui text-xs text-gray-500 uppercase tracking-widest mb-2">Legal Toolkit</p>
            <h2 className="font-display text-4xl text-white mb-3">Resources</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['FOIA Templates', 'Know Your Rights Cards', 'Attorney Directory', 'Court Filing Guides', '42 U.S.C. § 1983 Primer', 'Stop & Identify Laws by State'].map((r) => (
              <div key={r} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/8 rounded-xl hover:border-white/20 transition-colors cursor-pointer group">
                <span className="font-ui text-sm font-medium text-white">{r}</span>
                <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ── UPLOAD PAGE ── */}
      {activeTab === 'upload' && (
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <p className="font-ui text-xs text-red-500 uppercase tracking-widest mb-2">⚠ Report a Violation</p>
            <h2 className="font-display text-4xl text-white mb-3">Document an Incident</h2>
            <p className="font-ui text-gray-400 text-sm">All submissions are encrypted. Your identity is protected.</p>
          </div>
          <div className="space-y-4">
            {['Incident Type', 'Date & Location', 'Description', 'Upload Evidence'].map((step, i) => (
              <div key={step} className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/8 rounded-xl">
                <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-xs font-ui font-bold text-gray-400">{i + 1}</div>
                <span className="font-ui text-sm font-medium text-gray-300">{step}</span>
                <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
              </div>
            ))}
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-lg font-ui font-semibold text-sm transition-colors mt-2">
              Begin Report
            </button>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-red-500" />
              <span className="font-display text-[15px] text-white">Civil Rights Hub</span>
            </div>
            <p className="font-ui text-xs text-gray-600 max-w-sm">
              Forensic documentation of constitutional violations. All recordings are backed up and encrypted. Your safety is our mission.
            </p>
            <div className="flex gap-4">
              {['Privacy', 'Legal', 'Contact'].map((l) => (
                <a key={l} href="#" className="font-ui text-xs text-gray-500 hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
