import React, { useState, useEffect, useRef } from 'react';
import {
  Scale, Search, BookOpen, FileText, Users, User,
  Menu, X, ChevronRight, Shield, Gavel, AlertTriangle,
  Radio, Video, MapPin, FileSearch, Activity, ArrowRight,
  Camera, Wifi, WifiOff, BadgeCheck, Building2, Globe,
  TrendingUp, Star, Clock, CheckCircle2, XCircle,
  Mic, Phone, Mail, ExternalLink, Filter, BarChart2,
  UserCheck, Briefcase, Eye, Hash, ChevronDown
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// STATIC DATA — swap these for Supabase queries later
// ─────────────────────────────────────────────────────────────────

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

const CITIES = [
  { slug: 'oakland', name: 'Oakland', state: 'CA', violations: 142, attorneys: 8, members: 312, hearings: 2 },
  { slug: 'chicago', name: 'Chicago', state: 'IL', violations: 218, attorneys: 14, members: 587, hearings: 4 },
  { slug: 'houston', name: 'Houston', state: 'TX', violations: 97, attorneys: 6, members: 241, hearings: 1 },
  { slug: 'los-angeles', name: 'Los Angeles', state: 'CA', violations: 334, attorneys: 22, members: 891, hearings: 6 },
  { slug: 'new-york', name: 'New York', state: 'NY', violations: 411, attorneys: 31, members: 1204, hearings: 9 },
  { slug: 'atlanta', name: 'Atlanta', state: 'GA', violations: 88, attorneys: 7, members: 198, hearings: 1 },
  { slug: 'minneapolis', name: 'Minneapolis', state: 'MN', violations: 76, attorneys: 5, members: 167, hearings: 2 },
  { slug: 'dallas', name: 'Dallas', state: 'TX', violations: 63, attorneys: 4, members: 143, hearings: 1 },
];

const CITY_DATA = {
  oakland: {
    name: 'Oakland', state: 'CA',
    recentViolations: [
      { id: 1, date: '2026-04-22', officer: 'Ofc. D. Martinez', agency: 'OPD', amendment: '4th', type: 'Unlawful search', status: 'Under review' },
      { id: 2, date: '2026-04-19', officer: 'Sgt. K. Renner', agency: 'OPD', amendment: '1st', type: 'Recording interference', status: 'Filed' },
      { id: 3, date: '2026-04-15', officer: 'Lt. J. Howell', agency: 'BART PD', amendment: '4th', type: 'Stop & ID coercion', status: 'Hearing set' },
    ],
    attorneys: [
      { name: 'Maya Okonkwo', role: 'Civil Rights Attorney', verified: true, cases: 34, phone: '(510) 555-0182' },
      { name: 'Rafael Tomas', role: 'Constitutional Lawyer', verified: true, cases: 21, phone: '(510) 555-0219' },
      { name: 'Sandra Wu', role: 'ACLU Liaison', verified: false, cases: 9, phone: '(510) 555-0307' },
    ],
    scanners: [
      { label: 'OPD Dispatch — Channel 1', freq: '460.050 MHz', active: true },
      { label: 'BART Police', freq: '453.225 MHz', active: true },
      { label: 'Alameda County Sheriff', freq: '154.920 MHz', active: false },
    ],
    upcomingHearings: [
      { date: '2026-04-28', court: 'Alameda County Superior', case: 'Johnson v. OPD', type: 'Preliminary Hearing' },
      { date: '2026-05-03', court: 'N.D. Cal. Federal', case: 'Williams v. City of Oakland', type: 'Motion to Suppress' },
    ],
    members: 312,
  },
};

const OFFICERS = [
  {
    id: 'ofc-d-martinez',
    name: 'D. Martinez',
    agency: 'Oakland PD',
    badge: '#4412',
    rank: 'Officer',
    violations: 7,
    amendments: ['4th', '1st'],
    lastReport: '2026-04-22',
    status: 'Active — Under IA review',
    severity: 'high',
  },
  {
    id: 'sgt-k-renner',
    name: 'K. Renner',
    agency: 'Oakland PD',
    badge: '#3871',
    rank: 'Sergeant',
    violations: 12,
    amendments: ['1st', '4th', '14th'],
    lastReport: '2026-04-19',
    status: 'Active',
    severity: 'critical',
  },
  {
    id: 'lt-j-howell',
    name: 'J. Howell',
    agency: 'BART PD',
    badge: '#0219',
    rank: 'Lieutenant',
    violations: 3,
    amendments: ['4th'],
    lastReport: '2026-04-15',
    status: 'Active',
    severity: 'medium',
  },
  {
    id: 'ofc-r-banks',
    name: 'R. Banks',
    agency: 'Chicago PD',
    badge: '#7723',
    rank: 'Officer',
    violations: 19,
    amendments: ['4th', '8th', '14th'],
    lastReport: '2026-04-20',
    status: 'Active — Complaint pending',
    severity: 'critical',
  },
];

const AGENCIES = [
  { id: 'opd', name: 'Oakland Police Department', city: 'Oakland, CA', officers: 4, violations: 142, topAmendment: '4th', trend: '+8%' },
  { id: 'cpd', name: 'Chicago Police Department', city: 'Chicago, IL', officers: 22, violations: 218, topAmendment: '4th', trend: '+3%' },
  { id: 'bart-pd', name: 'BART Police Department', city: 'Oakland, CA', officers: 2, violations: 31, topAmendment: '4th', trend: '-4%' },
  { id: 'lasd', name: 'LA Sheriff Dept', city: 'Los Angeles, CA', officers: 18, violations: 334, topAmendment: '14th', trend: '+12%' },
];

const AMENDMENTS = [
  { num: '1st', label: 'Speech & Assembly', short: 'Free speech, press, religion, assembly, petition', color: 'from-blue-900/60' },
  { num: '4th', label: 'Search & Seizure', short: 'Protection from unreasonable searches', color: 'from-purple-900/60' },
  { num: '5th', label: 'Due Process', short: 'Self-incrimination & double jeopardy protection', color: 'from-amber-900/60' },
  { num: '6th', label: 'Fair Trial', short: 'Right to counsel & speedy public trial', color: 'from-teal-900/60' },
  { num: '8th', label: 'Cruel Punishment', short: 'Prohibits excessive bail and cruel punishment', color: 'from-rose-900/60' },
  { num: '10th', label: "States' Rights", short: "Powers reserved to states or the people", color: 'from-indigo-900/60' },
  { num: '14th', label: 'Equal Protection', short: 'Citizenship, due process & equal protection', color: 'from-green-900/60' },
];

// ─────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────

const LiveTicker = () => {
  const text = TICKER_ITEMS.join('   ·   ');
  return (
    <div className="bg-[#0d0d0d] border-b border-red-900/40 overflow-hidden h-9 flex items-center">
      <div className="flex-shrink-0 bg-red-700 text-white text-[10px] font-bold tracking-widest uppercase px-3 h-full flex items-center z-10">
        LIVE
      </div>
      <div className="relative overflow-hidden flex-1">
        <div className="ticker-scroll whitespace-nowrap text-[12px] text-gray-400">
          {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
    </div>
  );
};

const VerifiedBadge = ({ role = 'verified' }) => {
  const colors = {
    attorney: 'text-blue-400 bg-blue-950/60 border-blue-800/50',
    journalist: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/50',
    observer: 'text-violet-400 bg-violet-950/60 border-violet-800/50',
    verified: 'text-white bg-white/10 border-white/20',
  };
  const labels = { attorney: 'Attorney', journalist: 'Journalist', observer: 'Legal Observer', verified: 'Verified' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${colors[role] || colors.verified}`}>
      <BadgeCheck className="h-3 w-3" />
      {labels[role] || 'Verified'}
    </span>
  );
};

const SeverityDot = ({ level }) => {
  const c = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-gray-500' };
  return <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${c[level] || c.low}`} />;
};

const PageHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10">
    {eyebrow && <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">{eyebrow}</p>}
    <h2 className="font-display text-4xl sm:text-5xl text-white mb-3">{title}</h2>
    {subtitle && <p className="text-gray-400 text-base leading-relaxed max-w-2xl">{subtitle}</p>}
  </div>
);

const AmendmentTag = ({ num }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[11px] font-semibold text-gray-300">
    {num}
  </span>
);

// ─────────────────────────────────────────────────────────────────
// MAP DOTS (hero bg)
// ─────────────────────────────────────────────────────────────────
const MapDots = () => {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i, x: 10 + (i * 4.8) % 82, y: 15 + (i * 7.3) % 72,
    delay: (i * 0.38) % 4,
    size: i % 3 === 0 ? 'large' : 'small',
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(220,38,38,0.8) 1px, transparent 1px),linear-gradient(90deg, rgba(220,38,38,0.8) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {dots.map((dot) => (
        <div key={dot.id} className="absolute" style={{ left: `${dot.x}%`, top: `${dot.y}%` }}>
          {dot.size === 'large' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation: `pulseGlow ${2 + dot.delay * 0.3}s ease-in-out infinite`, animationDelay: `${dot.delay}s` }} />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 opacity-40" style={{ animation: `ripple ${2 + dot.delay * 0.3}s ease-out infinite`, animationDelay: `${dot.delay}s` }} />
            </>
          ) : (
            <div className="w-1 h-1 rounded-full bg-red-700 opacity-60" style={{ animation: `blink ${3 + dot.delay}s ease-in-out infinite`, animationDelay: `${dot.delay}s` }} />
          )}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// PAGE: HOME
// ─────────────────────────────────────────────────────────────────
const HomePage = ({ nav }) => (
  <main>
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#080808]">
      <MapDots />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#080808]/40 to-[#080808] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-[#080808]/40 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <div className="hero-animate flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-red-400">Live · Documenting America's Rights in Real Time</span>
          </div>
          <h1 className="hero-animate-2 font-display text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-8">
            Your rights.<br />
            <span className="italic text-red-400">Documented.</span><br />
            Defended.
          </h1>
          <p className="hero-animate-3 text-lg text-gray-400 leading-relaxed mb-10 max-w-xl">
            Report violations, track FOIA requests, access landmark case law, and livestream encounters — all in one platform built for citizens on the front lines.
          </p>
          <div className="hero-animate-3 flex flex-wrap items-center gap-4">
            <button onClick={() => nav('upload')} className="group flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 rounded font-semibold text-[15px] transition-all">
              <AlertTriangle className="h-4 w-4" /> Report a Violation
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => nav('cities')} className="flex items-center gap-2 text-gray-300 hover:text-white border border-white/15 hover:border-white/30 px-7 py-3.5 rounded font-medium text-[15px] transition-all">
              <MapPin className="h-4 w-4" /> Find Your City
            </button>
          </div>
          <div className="hero-animate-3 flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/8">
            {[{ value: '2,847', label: 'Cases Documented' }, { value: '47', label: 'Active FOIAs' }, { value: '12', label: 'Reports Today' }].map(s => (
              <div key={s.label}>
                <div className="font-display text-3xl text-white">{s.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Amendments */}
    <section className="border-t border-white/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Constitutional Protections</p>
            <h2 className="font-display text-4xl text-white">Know your amendments</h2>
          </div>
          <button onClick={() => nav('search')} className="hidden sm:flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
            Search case law <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {AMENDMENTS.map(am => (
            <button key={am.num} onClick={() => nav('search')} className={`group relative p-4 rounded-xl border border-white/8 bg-gradient-to-b ${am.color} to-transparent hover:border-white/20 transition-all text-left`}>
              <div className="font-display text-3xl text-gray-500 group-hover:text-white transition-colors mb-3">{am.num}</div>
              <div className="text-[13px] font-semibold text-white mb-1">{am.label}</div>
              <div className="text-[11px] text-gray-500 leading-relaxed">{am.short}</div>
            </button>
          ))}
        </div>
      </div>
    </section>

    {/* Bottom CTAs */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-red-900/50 bg-red-950/20 p-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
          <h3 className="font-display text-3xl text-white mb-3">Under threat?</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">Document everything. Our platform auto-saves recordings to secure backup so evidence can't be deleted.</p>
          <button onClick={() => nav('upload')} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded font-medium text-sm transition-colors">
            Start Emergency Report <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <MapPin className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="font-display text-3xl text-white mb-3">Your city</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">Local violations, attorneys, scanners, and hearings — all in one place. Find your chapter and connect.</p>
          <button onClick={() => nav('cities')} className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded font-medium text-sm transition-colors">
            View City Pages <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <Building2 className="h-8 w-8 text-orange-400 mb-4" />
          <h3 className="font-display text-3xl text-white mb-3">Officer profiles</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">Searchable records aggregating violations per officer and agency. Accountability made public.</p>
          <button onClick={() => nav('officers')} className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded font-medium text-sm transition-colors">
            Browse Officers <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  </main>
);

// ─────────────────────────────────────────────────────────────────
// PAGE: CITIES
// ─────────────────────────────────────────────────────────────────
const CitiesPage = ({ nav, setActiveCitySlug }) => {
  const [search, setSearch] = useState('');
  const filtered = CITIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Local Chapters"
        title="Cities"
        subtitle="Each city page shows recent violations, verified local attorneys, active scanner frequencies, upcoming hearings, and community members. Find yours — and share it."
      />
      <div className="relative mb-8 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter cities…"
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {filtered.map(city => (
          <button key={city.slug} onClick={() => { setActiveCitySlug(city.slug); nav('city'); }}
            className="group text-left p-6 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-display text-2xl text-white">{city.name}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{city.state}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Violations', value: city.violations, color: 'text-red-400' },
                { label: 'Members', value: city.members, color: 'text-blue-400' },
                { label: 'Attorneys', value: city.attorneys, color: 'text-emerald-400' },
                { label: 'Hearings', value: city.hearings, color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label}>
                  <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[11px] text-gray-600 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>
      <div className="border border-dashed border-white/10 rounded-xl p-8 text-center">
        <Globe className="h-8 w-8 text-gray-600 mx-auto mb-3" />
        <div className="font-semibold text-white mb-1">Don't see your city?</div>
        <p className="text-sm text-gray-500 mb-4">Start a chapter. All you need is one documented violation.</p>
        <button onClick={() => nav('upload')} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded text-sm font-medium transition-colors">
          Start a Chapter
        </button>
      </div>
    </main>
  );
};

// ─────────────────────────────────────────────────────────────────
// PAGE: CITY DETAIL
// ─────────────────────────────────────────────────────────────────
const CityPage = ({ slug, nav }) => {
  const city = CITY_DATA[slug] || CITY_DATA.oakland;
  const cityMeta = CITIES.find(c => c.slug === slug) || CITIES[0];
  const [activeSection, setActiveSection] = useState('violations');
  const sections = [
    { id: 'violations', label: 'Violations' },
    { id: 'attorneys', label: 'Attorneys' },
    { id: 'scanners', label: 'Scanners' },
    { id: 'hearings', label: 'Hearings' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => nav('cities')} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
        <ChevronRight className="h-4 w-4 rotate-180" /> All Cities
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Local Chapter</p>
          <h1 className="font-display text-5xl text-white">{city.name}</h1>
          <p className="text-gray-400 mt-1">{city.state} · {city.members.toLocaleString()} active members</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded text-sm transition-colors">
            <Users className="h-3.5 w-3.5" /> Join Chapter
          </button>
          <button onClick={() => nav('upload')} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
            <AlertTriangle className="h-3.5 w-3.5" /> Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Violations', value: cityMeta.violations, color: 'text-red-400' },
          { label: 'Verified Attorneys', value: city.attorneys.filter(a => a.verified).length, color: 'text-emerald-400' },
          { label: 'Scanner Feeds', value: city.scanners.length, color: 'text-blue-400' },
          { label: 'Upcoming Hearings', value: city.upcomingHearings.length, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <div className={`font-display text-3xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mb-8 border-b border-white/8">
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeSection === s.id ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'violations' && (
        <div className="space-y-3">
          {city.recentViolations.map(v => (
            <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.03] border border-white/8 rounded-xl hover:border-white/15 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-[11px] text-gray-500 w-20 shrink-0 mt-0.5">{v.date}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{v.officer}</span>
                    <span className="text-xs text-gray-500">· {v.agency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AmendmentTag num={v.amendment} />
                    <span className="text-xs text-gray-400">{v.type}</span>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
                v.status === 'Hearing set' ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                : v.status === 'Filed' ? 'bg-blue-950/60 text-blue-400 border border-blue-800/50'
                : 'bg-white/5 text-gray-400 border border-white/10'
              }`}>{v.status}</span>
            </div>
          ))}
          <button onClick={() => nav('search')} className="w-full mt-2 py-3 text-sm text-gray-500 hover:text-white border border-white/8 hover:border-white/20 rounded-xl transition-colors">
            View all violations in {city.name} →
          </button>
        </div>
      )}

      {activeSection === 'attorneys' && (
        <div className="space-y-3">
          {city.attorneys.map(a => (
            <div key={a.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.03] border border-white/8 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                  {a.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{a.name}</span>
                    {a.verified && <VerifiedBadge role="attorney" />}
                  </div>
                  <div className="text-xs text-gray-500">{a.role} · {a.cases} cases documented</div>
                </div>
              </div>
              <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Phone className="h-3.5 w-3.5" />{a.phone}
              </a>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'scanners' && (
        <div className="space-y-3">
          {city.scanners.map(s => (
            <div key={s.label} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/8 rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${s.active ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                <div>
                  <div className="font-medium text-white text-sm">{s.label}</div>
                  <div className="text-xs text-gray-500 font-mono">{s.freq}</div>
                </div>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.active ? 'text-green-400 bg-green-950/50' : 'text-gray-500 bg-white/5'}`}>
                {s.active ? 'Active' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'hearings' && (
        <div className="space-y-3">
          {city.upcomingHearings.map((h, i) => (
            <div key={i} className="p-5 bg-white/[0.03] border border-amber-800/30 rounded-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-white mb-1">{h.case}</div>
                  <div className="text-xs text-gray-500 mb-2">{h.court}</div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-400 text-[11px] font-semibold">{h.type}</span>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display text-2xl text-amber-400">{h.date.split('-')[2]}</div>
                  <div className="text-[11px] text-gray-500 uppercase tracking-widest">
                    {new Date(h.date).toLocaleString('default', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

// ─────────────────────────────────────────────────────────────────
// PAGE: VERIFIED BADGE APPLICATION
// ─────────────────────────────────────────────────────────────────
const VerifyPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name: '', email: '', org: '', barNumber: '', credential: '', statement: '' });
  const [submitted, setSubmitted] = useState(false);

  const roles = [
    { id: 'attorney', icon: Briefcase, label: 'Licensed Attorney', desc: 'Bar-admitted legal counsel. Verified attorneys get pinned on city pages and can post legal alerts.' },
    { id: 'journalist', icon: Mic, label: 'Journalist', desc: 'Working press. Verified journalists can publish reports with a byline badge and press credential link.' },
    { id: 'observer', icon: Eye, label: 'Legal Observer', desc: 'Trained observation roles (NLG, ACLU, etc.). Verified observers are listed for deployment to incidents.' },
  ];

  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };

  if (submitted) return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-6" />
      <h2 className="font-display text-4xl text-white mb-3">Application submitted</h2>
      <p className="text-gray-400 leading-relaxed mb-2">
        We'll review your credentials within 48–72 hours. You'll receive an email at <span className="text-white">{form.email}</span> when your badge is approved.
      </p>
      <p className="text-xs text-gray-600 mt-6">Once verified, your profile will show a badge and you'll appear on relevant city pages and the attorney directory.</p>
    </main>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Trust & Verification"
        title="Apply for a Verified Badge"
        subtitle="Verified users build trust, drive content, and are surfaced prominently on city pages and searches."
      />

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map(s => (
          <React.Fragment key={s}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step > s ? 'bg-emerald-600 text-white' : step === s ? 'bg-white text-black' : 'bg-white/10 text-gray-500'
            }`}>
              {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-px ${step > s ? 'bg-emerald-600' : 'bg-white/10'}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="font-semibold text-white mb-5">Select your role</p>
          <div className="space-y-3">
            {roles.map(r => {
              const Icon = r.icon;
              return (
                <button key={r.id} onClick={() => setRole(r.id)}
                  className={`w-full text-left p-5 rounded-xl border transition-all ${
                    role === r.id ? 'border-white/30 bg-white/[0.08]' : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                  }`}>
                  <div className="flex items-start gap-4">
                    <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${role === r.id ? 'text-white' : 'text-gray-500'}`} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{r.label}</span>
                        <VerifiedBadge role={r.id} />
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <button disabled={!role} onClick={() => setStep(2)}
            className="mt-6 w-full py-3 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={e => { e.preventDefault(); setStep(3); }}>
          <p className="font-semibold text-white mb-5">Your credentials</p>
          <div className="space-y-4">
            {[
              { key: 'name', label: 'Full Legal Name', placeholder: 'As it appears on credentials', required: true },
              { key: 'email', label: 'Email Address', placeholder: 'For badge notification', required: true },
              { key: 'org', label: role === 'attorney' ? 'Law Firm / Organization' : role === 'journalist' ? 'Media Outlet / Publication' : 'Organization (NLG, ACLU, etc.)', placeholder: '', required: true },
              ...(role === 'attorney' ? [{ key: 'barNumber', label: 'State Bar Number', placeholder: 'e.g. CA-123456', required: true }] : []),
              { key: 'credential', label: 'Credential URL', placeholder: 'LinkedIn, bar.org, press page…', required: false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">{f.label}{f.required && ' *'}</label>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder} required={f.required}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(1)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors">Back</button>
            <button type="submit" className="flex-1 py-2.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors">Continue</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <p className="font-semibold text-white mb-5">Final step — brief statement</p>
          <p className="text-sm text-gray-400 mb-4">Why do you want to be verified on Civil Rights Hub? How will you contribute?</p>
          <textarea rows={5} required value={form.statement} onChange={e => setForm(p => ({ ...p, statement: e.target.value }))}
            placeholder="I am a civil rights attorney in Oakland with 12 years experience…"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 resize-none transition-colors mb-4" />
          <p className="text-[11px] text-gray-600 mb-5">By submitting, you certify that all information is accurate. False credentials will result in permanent account ban.</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors">Back</button>
            <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg transition-colors">
              Submit Application
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

// ─────────────────────────────────────────────────────────────────
// PAGE: OFFICERS & AGENCIES
// ─────────────────────────────────────────────────────────────────
const OfficersPage = ({ setActiveOfficerId, nav }) => {
  const [view, setView] = useState('officers');
  const [search, setSearch] = useState('');

  const filteredOfficers = OFFICERS.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) || o.agency.toLowerCase().includes(search.toLowerCase())
  );
  const filteredAgencies = AGENCIES.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Accountability Database"
        title="Officer & Agency Profiles"
        subtitle="Aggregated violation records per officer and agency, sourced from community reports. Searchable, shareable, public."
      />

      <div className="flex items-center gap-1 mb-6 p-1 bg-white/5 rounded-lg w-fit">
        {[{ id: 'officers', label: 'Officers' }, { id: 'agencies', label: 'Agencies' }].map(v => (
          <button key={v.id} onClick={() => setView(v.id)} className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${view === v.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${view}…`}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
      </div>

      {view === 'officers' && (
        <div className="space-y-3">
          {filteredOfficers.map(o => (
            <button key={o.id} onClick={() => { setActiveOfficerId(o.id); nav('officer'); }}
              className="group w-full text-left p-5 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-sm">
                      {o.name.split(' ').pop()[0]}
                    </div>
                    <SeverityDot level={o.severity} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-white">{o.rank} {o.name}</span>
                      <span className="text-xs text-gray-500 font-mono">{o.badge}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400">{o.agency}</span>
                      <span className="text-gray-700">·</span>
                      {o.amendments.map(a => <AmendmentTag key={a} num={a} />)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className={`font-display text-2xl ${o.severity === 'critical' ? 'text-red-400' : o.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'}`}>{o.violations}</div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">violations</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{o.status}</span>
                <span className="text-[11px] text-gray-600">Last: {o.lastReport}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {view === 'agencies' && (
        <div className="space-y-3">
          {filteredAgencies.map(a => (
            <div key={a.id} className="p-5 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-0.5">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.city}</div>
                  </div>
                </div>
                <div className="flex gap-8 shrink-0">
                  <div className="text-center">
                    <div className="font-display text-2xl text-red-400">{a.violations}</div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">violations</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-2xl text-gray-300">{a.officers}</div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">officers</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-display text-2xl ${a.trend.startsWith('+') ? 'text-red-400' : 'text-emerald-400'}`}>{a.trend}</div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-widest">30d trend</div>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                <span className="text-[11px] text-gray-500">Top amendment:</span>
                <AmendmentTag num={a.topAmendment} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

// ─────────────────────────────────────────────────────────────────
// PAGE: OFFICER PROFILE
// ─────────────────────────────────────────────────────────────────
const OfficerProfilePage = ({ officerId, nav }) => {
  const officer = OFFICERS.find(o => o.id === officerId) || OFFICERS[0];
  const cityViolations = CITY_DATA.oakland.recentViolations.filter(v =>
    v.officer.includes(officer.name.split(' ').pop())
  );
  const severityColors = {
    critical: 'text-red-400 border-red-800/50 bg-red-950/30',
    high: 'text-orange-400 border-orange-800/50 bg-orange-950/30',
    medium: 'text-yellow-400 border-yellow-800/50 bg-yellow-950/30',
    low: 'text-gray-400 border-gray-700 bg-gray-900/30'
  };
  const severityLabel = {
    critical: 'Critical — Multiple documented patterns',
    high: 'High — Repeat violations on record',
    medium: 'Medium — Isolated incidents',
    low: 'Low — Single report'
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => nav('officers')} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
        <ChevronRight className="h-4 w-4 rotate-180" /> All Officers
      </button>

      <div className="p-8 bg-white/[0.02] border border-white/8 rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-display text-2xl text-white">
                {officer.name.split(' ').pop()[0]}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${officer.severity === 'critical' ? 'bg-red-500' : officer.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
            </div>
            <div>
              <h1 className="font-display text-4xl text-white mb-1">{officer.rank} {officer.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-gray-400 text-sm">{officer.agency}</span>
                <span className="text-gray-600 text-xs font-mono">{officer.badge}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => nav('upload')} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              <AlertTriangle className="h-3.5 w-3.5" /> File Report
            </button>
            <button className="flex items-center gap-1.5 border border-white/15 hover:bg-white/10 text-gray-300 px-4 py-2 rounded text-sm transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Violations', value: officer.violations, color: 'text-red-400' },
          { label: 'Amendments', value: officer.amendments.length, color: 'text-blue-400' },
          { label: 'Last Report', value: officer.lastReport.split('-').slice(1).join('/'), color: 'text-gray-300' },
          { label: 'Severity', value: officer.severity.charAt(0).toUpperCase() + officer.severity.slice(1), color: officer.severity === 'critical' ? 'text-red-400' : 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <div className={`font-display text-2xl ${s.color} mb-1`}>{s.value}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      <div className={`flex items-center gap-3 p-4 rounded-xl border mb-8 ${severityColors[officer.severity]}`}>
        <BarChart2 className="h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold text-sm">{severityLabel[officer.severity]}</div>
          <div className="text-xs opacity-70 mt-0.5">{officer.status}</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Amendment Violations</h3>
        <div className="flex gap-2 flex-wrap">
          {officer.amendments.map(a => {
            const am = AMENDMENTS.find(x => x.num === a);
            return (
              <div key={a} className={`p-4 rounded-xl border border-white/8 bg-gradient-to-b ${am?.color || 'from-gray-900/60'} to-transparent min-w-[120px]`}>
                <div className="font-display text-2xl text-white mb-1">{a}</div>
                <div className="text-xs text-gray-400">{am?.label || ''}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Documented Incidents</h3>
        {cityViolations.length > 0 ? (
          <div className="space-y-3">
            {cityViolations.map(v => (
              <div key={v.id} className="p-5 bg-white/[0.03] border border-white/8 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AmendmentTag num={v.amendment} />
                    <span className="text-sm text-white">{v.type}</span>
                  </div>
                  <span className="text-xs text-gray-500">{v.date}</span>
                </div>
                <div className="text-xs text-gray-500">{v.agency} · Status: {v.status}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-white/[0.02] border border-white/8 rounded-xl text-center text-gray-500 text-sm">
            No incidents cross-referenced yet.{' '}
            <button onClick={() => nav('upload')} className="text-red-400 hover:text-red-300 transition-colors">File the first report.</button>
          </div>
        )}
      </div>
    </main>
  );
};

// ─────────────────────────────────────────────────────────────────
// OTHER PAGES
// ─────────────────────────────────────────────────────────────────
const SearchPage = ({ query, setQuery }) => (
  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <PageHeader eyebrow="Case Law Database" title="Search Civil Rights Opinions" />
    <form className="flex gap-2 mb-8" onSubmit={e => e.preventDefault()}>
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search opinions, amendments, violations…"
          className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
      </div>
      <button className="px-6 py-3.5 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors">Search</button>
    </form>
    <div className="bg-white/[0.03] border border-white/8 rounded-xl p-8 text-center text-gray-500 text-sm">
      Full case law search with Supabase integration — connect to load results.
    </div>
  </main>
);

const LivestreamPage = () => (
  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-widest">Livestreaming</p>
        <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Auto-Backup On
        </span>
      </div>
      <h2 className="font-display text-4xl text-white mb-3">Go Live</h2>
      <p className="text-gray-400">Every stream is automatically saved and backed up. Evidence is preserved even if your device is seized.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
        <Radio className="h-6 w-6 text-red-400 mb-3" />
        <h3 className="font-semibold text-white mb-1">Live Broadcast</h3>
        <p className="text-sm text-gray-500 mb-4">Stream publicly. Viewers can witness in real time.</p>
        <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Start Public Stream
        </button>
      </div>
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-6">
        <Shield className="h-6 w-6 text-blue-400 mb-3" />
        <h3 className="font-semibold text-white mb-1">Private Secure Recording</h3>
        <p className="text-sm text-gray-500 mb-4">Record privately. Auto-uploaded to encrypted storage only you control.</p>
        <button className="flex items-center gap-2 border border-white/15 hover:bg-white/10 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
          <Camera className="h-4 w-4" /> Start Private Recording
        </button>
      </div>
    </div>
    <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-6 flex items-start gap-4">
      <WifiOff className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
      <div>
        <div className="font-semibold text-amber-300 mb-1">Streaming infrastructure reconnecting</div>
        <p className="text-sm text-gray-400">Live RTMP relay is being reconfigured. Recording and backup are active.</p>
      </div>
    </div>
  </main>
);

const ResourcesPage = () => (
  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <PageHeader eyebrow="Legal Toolkit" title="Resources" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {['FOIA Templates', 'Know Your Rights Cards', 'Attorney Directory', 'Court Filing Guides', '42 U.S.C. § 1983 Primer', 'Stop & Identify Laws by State'].map(r => (
        <div key={r} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/8 rounded-xl hover:border-white/20 transition-colors cursor-pointer group">
          <span className="text-sm font-medium text-white">{r}</span>
          <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
        </div>
      ))}
    </div>
  </main>
);

const UploadPage = () => (
  <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <p className="text-xs text-red-500 uppercase tracking-widest mb-2">⚠ Report a Violation</p>
    <h2 className="font-display text-4xl text-white mb-2">Document an Incident</h2>
    <p className="text-gray-400 text-sm mb-10">All submissions are encrypted. Your identity is protected.</p>
    <div className="space-y-3">
      {['Incident Type', 'Officer / Agency (optional)', 'Date & Location', 'Description', 'Upload Evidence'].map((step, i) => (
        <div key={step} className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/8 rounded-xl">
          <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">{i + 1}</div>
          <span className="text-sm font-medium text-gray-300">{step}</span>
          <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
        </div>
      ))}
      <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-lg font-semibold text-sm transition-colors mt-2">
        Begin Report
      </button>
    </div>
  </main>
);

// ─────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCitySlug, setActiveCitySlug] = useState('oakland');
  const [activeOfficerId, setActiveOfficerId] = useState('');

  const nav = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'cities', label: 'Cities', icon: MapPin },
    { id: 'officers', label: 'Officers', icon: Building2 },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'livestream', label: 'Live', icon: Radio, dot: true },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'verify', label: 'Get Verified', icon: BadgeCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100" style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-scroll { display:inline-block; animation:ticker 32s linear infinite; }
        .ticker-scroll:hover { animation-play-state:paused; }
        @keyframes pulseGlow { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes ripple { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(4);opacity:0} }
        @keyframes blink { 0%,100%{opacity:.6} 50%{opacity:.1} }
        @keyframes heroFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .hero-animate { animation:heroFade 0.9s ease forwards; }
        .hero-animate-2 { animation:heroFade 0.9s 0.2s ease forwards; opacity:0; }
        .hero-animate-3 { animation:heroFade 0.9s 0.4s ease forwards; opacity:0; }
      `}</style>

      <LiveTicker />

      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => nav('home')} className="flex items-center gap-2.5 group shrink-0">
              <Scale className="h-5 w-5 text-red-500 group-hover:text-red-400 transition-colors" />
              <span className="font-display text-[17px] text-white tracking-tight">Civil Rights Hub</span>
            </button>

            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => nav(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      activeTab === item.id ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}>
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                    {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => setIsAuthenticated(!isAuthenticated)}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white border border-white/15 rounded hover:bg-white/10 transition-colors">
                <User className="h-3.5 w-3.5" />
                {isAuthenticated ? 'Account' : 'Sign In'}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/5 bg-[#0a0a0a]">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => nav(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium ${
                      activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                    }`}>
                    <Icon className="h-4 w-4" />{item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {activeTab === 'home'      && <HomePage nav={nav} />}
      {activeTab === 'cities'    && <CitiesPage nav={nav} setActiveCitySlug={setActiveCitySlug} />}
      {activeTab === 'city'      && <CityPage slug={activeCitySlug} nav={nav} />}
      {activeTab === 'officers'  && <OfficersPage nav={nav} setActiveOfficerId={setActiveOfficerId} />}
      {activeTab === 'officer'   && <OfficerProfilePage officerId={activeOfficerId} nav={nav} />}
      {activeTab === 'verify'    && <VerifyPage />}
      {activeTab === 'search'    && <SearchPage query={searchQuery} setQuery={setSearchQuery} />}
      {activeTab === 'livestream'&& <LivestreamPage />}
      {activeTab === 'resources' && <ResourcesPage />}
      {activeTab === 'upload'    && <UploadPage />}

      <footer className="border-t border-white/5 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-red-500" />
              <span className="font-display text-[15px] text-white">Civil Rights Hub</span>
            </div>
            <p className="text-xs text-gray-600 max-w-sm">All recordings are backed up and encrypted. Your safety is our mission.</p>
            <div className="flex gap-4">
              {['Privacy', 'Legal', 'Contact'].map(l => (
                <a key={l} href="#" className="text-xs text-gray-500 hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
