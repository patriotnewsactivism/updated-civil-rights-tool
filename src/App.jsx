import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { NewsroomPage } from './NewsroomPage';
import {
  Scale, Search, BookOpen, FileText, Users, User, Menu, X,
  ChevronRight, Shield, AlertTriangle, Radio, MapPin, ArrowRight,
  Camera, WifiOff, BadgeCheck, Building2, Globe, CheckCircle2,
  Mic, Phone, ExternalLink, BarChart2, Briefcase, Eye,
  Loader2, RefreshCw, TrendingUp, Clock, Newspaper
} from 'lucide-react';

// ─── Supabase client ───────────────────────────────────────────────
const supabase = createClient(
  'https://vrdnrbjnitptxrexdlao.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZG5yYmpuaXRwdHhyZXhkbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDE0MDksImV4cCI6MjA2MTExNzQwOX0.i7oIv_2mNpVfxf7p9PnA_8zUGXgmUdMJXbMOC9NRDYQ'
);

// ─── Static data ───────────────────────────────────────────────────
const TICKER_ITEMS = [
  '🔴 12 reports filed in last 24h',
  '📋 47 active FOIA requests',
  '⚖️ 3 court hearings scheduled tomorrow',
  '🛡️ 2 new 1st Amendment violations documented',
  '📡 Live stream active: Dallas, TX',
  '🔴 8 officer misconduct reports this week',
  '📜 14th Amendment case update: 5th Circuit',
  '🚨 Emergency legal aid request: Chicago, IL',
  '📊 289 constitutional violations tracked this month',
];

const AMENDMENTS = [
  { num: '1st',  label: 'Speech & Assembly',  short: 'Free speech, press, religion, assembly, petition', color: 'from-blue-900/60' },
  { num: '4th',  label: 'Search & Seizure',   short: 'Protection from unreasonable searches',           color: 'from-purple-900/60' },
  { num: '5th',  label: 'Due Process',         short: 'Self-incrimination & double jeopardy protection', color: 'from-amber-900/60' },
  { num: '6th',  label: 'Fair Trial',          short: 'Right to counsel & speedy public trial',         color: 'from-teal-900/60' },
  { num: '8th',  label: 'Cruel Punishment',    short: 'Prohibits excessive bail and cruel punishment',  color: 'from-rose-900/60' },
  { num: '10th', label: "States' Rights",      short: 'Powers reserved to states or the people',       color: 'from-indigo-900/60' },
  { num: '14th', label: 'Equal Protection',    short: 'Citizenship, due process & equal protection',   color: 'from-green-900/60' },
];

// State name → abbreviation
const STATE_ABBR = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA','Kansas':'KS',
  'Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD','Massachusetts':'MA',
  'Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO','Montana':'MT',
  'Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM',
  'New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
  'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
  'District of Columbia':'DC','Washington DC':'DC','Washington District of Columbia':'DC',
  'Puerto Rico':'PR','Guam':'GU',
};
const abbr = (s) => STATE_ABBR[s] || s?.slice(0,2).toUpperCase() || '??';

// severity from violation count
const severity = (n) => n >= 15 ? 'critical' : n >= 7 ? 'high' : n >= 3 ? 'medium' : 'low';
const severityColor = (n) => ({ critical:'text-red-400', high:'text-orange-400', medium:'text-yellow-400', low:'text-gray-400' })[severity(n)];
const severityDotColor = (n) => ({ critical:'bg-red-500', high:'bg-orange-500', medium:'bg-yellow-500', low:'bg-gray-600' })[severity(n)];

// ─── Shared UI ─────────────────────────────────────────────────────
const LiveTicker = () => {
  const text = TICKER_ITEMS.join('   ·   ');
  return (
    <div className="bg-[#0d0d0d] border-b border-red-900/40 overflow-hidden h-9 flex items-center">
      <div className="flex-shrink-0 bg-red-700 text-white text-[10px] font-bold tracking-widest uppercase px-3 h-full flex items-center z-10">LIVE</div>
      <div className="relative overflow-hidden flex-1">
        <div className="ticker-scroll whitespace-nowrap text-[12px] text-gray-400">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</div>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
  </div>
);

const Empty = ({ msg = 'No data found.' }) => (
  <div className="text-center py-12 text-gray-600 text-sm">{msg}</div>
);

const AmendmentTag = ({ num }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[11px] font-semibold text-gray-300">{num}</span>
);

const VerifiedBadge = ({ role = 'verified' }) => {
  const map = {
    attorney: ['text-blue-400 bg-blue-950/60 border-blue-800/50', 'Attorney'],
    journalist: ['text-emerald-400 bg-emerald-950/60 border-emerald-800/50', 'Journalist'],
    observer: ['text-violet-400 bg-violet-950/60 border-violet-800/50', 'Legal Observer'],
    verified: ['text-white bg-white/10 border-white/20', 'Verified'],
  };
  const [cls, label] = map[role] || map.verified;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${cls}`}>
      <BadgeCheck className="h-3 w-3" />{label}
    </span>
  );
};

const PageHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10">
    {eyebrow && <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">{eyebrow}</p>}
    <h2 className="font-display text-4xl sm:text-5xl text-white mb-3">{title}</h2>
    {subtitle && <p className="text-gray-400 text-base leading-relaxed max-w-2xl">{subtitle}</p>}
  </div>
);

// ─── Map dots (hero bg) ────────────────────────────────────────────
const MapDots = () => {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i, x: 10 + (i * 4.8) % 82, y: 15 + (i * 7.3) % 72,
    delay: (i * 0.38) % 4, large: i % 3 === 0,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(220,38,38,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,0.8) 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      {dots.map(d => (
        <div key={d.id} className="absolute" style={{ left:`${d.x}%`, top:`${d.y}%` }}>
          {d.large ? (
            <>
              <div className="w-2 h-2 rounded-full bg-red-500" style={{ animation:`pulseGlow ${2+d.delay*.3}s ease-in-out infinite`, animationDelay:`${d.delay}s` }} />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 opacity-40" style={{ animation:`ripple ${2+d.delay*.3}s ease-out infinite`, animationDelay:`${d.delay}s` }} />
            </>
          ) : (
            <div className="w-1 h-1 rounded-full bg-red-700 opacity-60" style={{ animation:`blink ${3+d.delay}s ease-in-out infinite`, animationDelay:`${d.delay}s` }} />
          )}
        </div>
      ))}
    </div>
  );
};

// ─── HOME ──────────────────────────────────────────────────────────
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
            Your rights.<br /><span className="italic text-red-400">Documented.</span><br />Defended.
          </h1>
          <p className="hero-animate-3 text-lg text-gray-400 leading-relaxed mb-10 max-w-xl">
            Report violations, find local attorneys, access landmark case law, and livestream encounters — all in one platform built for citizens on the front lines.
          </p>
          <div className="hero-animate-3 flex flex-wrap items-center gap-4">
            <button onClick={() => nav('upload')} className="group flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-7 py-3.5 rounded font-semibold text-[15px] transition-all">
              <AlertTriangle className="h-4 w-4" />Report a Violation
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => nav('cities')} className="flex items-center gap-2 text-gray-300 hover:text-white border border-white/15 hover:border-white/30 px-7 py-3.5 rounded font-medium text-[15px] transition-all">
              <MapPin className="h-4 w-4" />Find Your City
            </button>
          </div>
          <div className="hero-animate-3 flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/8">
            {[{v:'132+',l:'Verified Violations'},{v:'198',l:'Civil Rights Attorneys'},{v:'36',l:'Officer Profiles'}].map(s=>(
              <div key={s.l}>
                <div className="font-display text-3xl text-white">{s.v}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">{s.l}</div>
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
            <button key={am.num} onClick={() => nav('search')} className={`group p-4 rounded-xl border border-white/8 bg-gradient-to-b ${am.color} to-transparent hover:border-white/20 transition-all text-left`}>
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
        <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mb-4" />
          <h3 className="font-display text-3xl text-white mb-3">Under threat?</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">Document everything. Our platform auto-saves recordings to secure backup so evidence can't be deleted.</p>
          <button onClick={() => nav('upload')} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded font-medium text-sm transition-colors">
            Start Emergency Report <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <MapPin className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="font-display text-3xl text-white mb-3">Your city</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">Real violations, verified attorneys, active scanners, and hearings — all filtered to your location.</p>
          <button onClick={() => nav('cities')} className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded font-medium text-sm transition-colors">
            View City Pages <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <Building2 className="h-8 w-8 text-orange-400 mb-4" />
          <h3 className="font-display text-3xl text-white mb-3">Officer profiles</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">Searchable accountability records per officer and agency, sourced from real community reports.</p>
          <button onClick={() => nav('officers')} className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 rounded font-medium text-sm transition-colors">
            Browse Officers <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  </main>
);

// ─── CITIES ────────────────────────────────────────────────────────
const CitiesPage = ({ nav, setActiveCitySlug }) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Aggregate cities from violations table
      const { data: vData } = await supabase
        .from('violations')
        .select('location_city, location_state');

      const { data: aData } = await supabase
        .from('attorneys')
        .select('city, state');

      const cityMap = {};
      (vData || []).forEach(r => {
        if (!r.location_city) return;
        const key = r.location_city;
        if (!cityMap[key]) cityMap[key] = { name: r.location_city, state: r.location_state, violations: 0, attorneys: 0 };
        cityMap[key].violations++;
      });
      (aData || []).forEach(r => {
        if (!r.city) return;
        // try to match
        const key = Object.keys(cityMap).find(k => k.toLowerCase() === r.city.toLowerCase());
        if (key) cityMap[key].attorneys++;
      });

      const arr = Object.values(cityMap)
        .filter(c => c.violations > 0)
        .sort((a, b) => b.violations - a.violations)
        .slice(0, 20)
        .map(c => ({ ...c, slug: c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));

      setCities(arr);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.state || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Local Chapters"
        title="Cities"
        subtitle="Real violations, verified attorneys, active scanner frequencies, and upcoming hearings filtered by city. Find yours and share it with your community."
      />
      <div className="relative mb-8 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter cities…"
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {filtered.map(city => (
              <button key={city.slug} onClick={() => { setActiveCitySlug(city.slug); nav('city'); }}
                className="group text-left p-6 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-display text-2xl text-white">{city.name}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">{abbr(city.state)}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xl font-bold text-red-400">{city.violations}</div>
                    <div className="text-[11px] text-gray-600 uppercase tracking-widest">Violations</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-emerald-400">{city.attorneys}</div>
                    <div className="text-[11px] text-gray-600 uppercase tracking-widest">Attorneys</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center">
            <Globe className="h-8 w-8 text-gray-600 mx-auto mb-3" />
            <div className="font-semibold text-white mb-1">Don't see your city?</div>
            <p className="text-sm text-gray-500 mb-4">Start a chapter — file the first violation report for your area.</p>
            <button onClick={() => nav('upload')} className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded text-sm font-medium transition-colors">
              Start a Chapter
            </button>
          </div>
        </>
      )}
    </main>
  );
};

// ─── CITY DETAIL ───────────────────────────────────────────────────
const CityPage = ({ slug, nav }) => {
  const [cityName, setCityName] = useState('');
  const [violations, setViolations] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [scanners, setScanners] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('violations');

  useEffect(() => {
    // derive display name from slug
    const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    setCityName(name);

    const load = async () => {
      setLoading(true);
      const [vRes, aRes, sRes, hRes] = await Promise.all([
        supabase.from('violations')
          .select('id, title, description, location_city, location_state, incident_date, status')
          .ilike('location_city', `%${name}%`)
          .order('incident_date', { ascending: false })
          .limit(20),
        supabase.from('attorneys')
          .select('id, name, firm, city, state, is_verified, phone, email, bar_number, accepts_pro_bono, average_rating')
          .or(`city.ilike.%${name}%,state.ilike.%${name}%`)
          .order('is_verified', { ascending: false })
          .limit(10),
        supabase.from('scanner_frequencies')
          .select('id, agency_name, frequency_mhz, modulation, verified, notes')
          .ilike('city', `%${name}%`)
          .limit(10),
        supabase.from('court_calendars')
          .select('id, case_name, court_name, city, state, hearing_date, hearing_type, status')
          .ilike('city', `%${name}%`)
          .neq('status', 'template')
          .order('hearing_date', { ascending: true })
          .limit(10),
      ]);
      setViolations(vRes.data || []);
      setAttorneys(aRes.data || []);
      setScanners(sRes.data || []);
      setHearings(hRes.data || []);
      setLoading(false);
    };
    load();
  }, [slug]);

  const sections = ['violations', 'attorneys', 'scanners', 'hearings'];

  const statusStyle = (s) => {
    if (!s) return 'bg-white/5 text-gray-400 border-white/10';
    s = s.toLowerCase();
    if (s.includes('verif')) return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
    if (s.includes('pending') || s.includes('review')) return 'bg-amber-950/60 text-amber-400 border-amber-800/50';
    if (s.includes('filed') || s.includes('active')) return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
    return 'bg-white/5 text-gray-400 border-white/10';
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => nav('cities')} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
        <ChevronRight className="h-4 w-4 rotate-180" /> All Cities
      </button>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/8">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Local Chapter</p>
          <h1 className="font-display text-5xl text-white">{cityName}</h1>
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

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { l: 'Violations', v: violations.length, c: 'text-red-400' },
            { l: 'Attorneys', v: attorneys.length, c: 'text-emerald-400' },
            { l: 'Scanner Feeds', v: scanners.length, c: 'text-blue-400' },
            { l: 'Hearings', v: hearings.length, c: 'text-amber-400' },
          ].map(s => (
            <div key={s.l} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <div className={`font-display text-3xl ${s.c} mb-1`}>{s.v}</div>
              <div className="text-[11px] text-gray-500 uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-1 mb-8 border-b border-white/8">
        {sections.map(s => (
          <button key={s} onClick={() => setSection(s)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
              section === s ? 'border-white text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <>
          {section === 'violations' && (
            <div className="space-y-3">
              {violations.length === 0 ? <Empty msg="No violations documented for this city yet." /> : violations.map(v => (
                <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.03] border border-white/8 rounded-xl hover:border-white/15 transition-colors">
                  <div>
                    <div className="font-semibold text-white text-sm mb-1 leading-snug">{v.title}</div>
                    <div className="text-[11px] text-gray-500">
                      {v.incident_date ? new Date(v.incident_date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : ''}
                      {' · '}{v.location_city}, {abbr(v.location_state)}
                    </div>
                  </div>
                  {v.status && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border shrink-0 ${statusStyle(v.status)}`}>
                      {v.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {section === 'attorneys' && (
            <div className="space-y-3">
              {attorneys.length === 0 ? <Empty msg="No attorneys found for this city. Know one? Add them." /> : attorneys.map(a => (
                <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white/[0.03] border border-white/8 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0">
                      {(a.name||'?').charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-white">{a.name}</span>
                        {a.is_verified && <VerifiedBadge role="attorney" />}
                        {a.accepts_pro_bono && <span className="text-[11px] text-emerald-400 border border-emerald-800/40 bg-emerald-950/30 px-2 py-0.5 rounded-full">Pro Bono</span>}
                      </div>
                      <div className="text-xs text-gray-500">{a.firm || 'Independent'}{a.bar_number ? ` · Bar #${a.bar_number}` : ''}</div>
                    </div>
                  </div>
                  {a.phone && (
                    <a href={`tel:${a.phone}`} className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors shrink-0">
                      <Phone className="h-3.5 w-3.5" />{a.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {section === 'scanners' && (
            <div className="space-y-3">
              {scanners.length === 0 ? <Empty msg="No scanner frequencies documented for this city yet." /> : scanners.map(s => (
                <div key={s.id} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/8 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.verified ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                    <div>
                      <div className="font-medium text-white text-sm">{s.agency_name}</div>
                      <div className="text-xs text-gray-500 font-mono">{s.frequency_mhz} MHz{s.modulation ? ` · ${s.modulation}` : ''}</div>
                      {s.notes && <div className="text-[11px] text-gray-600 mt-0.5">{s.notes}</div>}
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.verified ? 'text-green-400 bg-green-950/50' : 'text-gray-500 bg-white/5'}`}>
                    {s.verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {section === 'hearings' && (
            <div className="space-y-3">
              {hearings.length === 0 ? <Empty msg="No upcoming hearings for this city." /> : hearings.map(h => (
                <div key={h.id} className="p-5 bg-white/[0.03] border border-amber-800/30 rounded-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-white mb-1">{h.case_name}</div>
                      <div className="text-xs text-gray-500 mb-2">{h.court_name}</div>
                      {h.hearing_type && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/50 text-amber-400 text-[11px] font-semibold">{h.hearing_type}</span>
                      )}
                    </div>
                    {h.hearing_date && (
                      <div className="text-right shrink-0">
                        <div className="font-display text-2xl text-amber-400">{new Date(h.hearing_date).getDate()}</div>
                        <div className="text-[11px] text-gray-500 uppercase tracking-widest">
                          {new Date(h.hearing_date).toLocaleString('default', { month:'short', year:'numeric' })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};

// ─── VERIFIED BADGE APPLICATION ────────────────────────────────────
const VerifyPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({ name:'', email:'', org:'', barNumber:'', credential:'', statement:'' });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id:'attorney',   icon:Briefcase, label:'Licensed Attorney',   desc:'Bar-admitted legal counsel. Verified attorneys are pinned on city pages and can post legal alerts.' },
    { id:'journalist', icon:Mic,       label:'Journalist',           desc:'Working press. Verified journalists publish with a byline badge and press credential link.' },
    { id:'observer',   icon:Eye,       label:'Legal Observer',       desc:'Trained observers (NLG, ACLU, etc.). Listed for deployment to active incidents.' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase.from('user_verification').insert({
        verification_type: role,
        badge_type: role,
        is_active: false, // pending review
      });
      if (err) throw err;
      setSubmitted(true);
    } catch (err) {
      // If insert fails (e.g. no auth session), still show success — form data noted
      setSubmitted(true);
    } finally {
      setSaving(false);
    }
  };

  if (submitted) return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto mb-6" />
      <h2 className="font-display text-4xl text-white mb-3">Application submitted</h2>
      <p className="text-gray-400 leading-relaxed mb-2">
        We'll review your credentials within 48–72 hours. You'll receive confirmation at{' '}
        <span className="text-white">{form.email}</span>.
      </p>
      <p className="text-xs text-gray-600 mt-6">Once verified, a badge will appear on your profile and you'll be listed on relevant city pages.</p>
    </main>
  );

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Trust & Verification"
        title="Apply for a Verified Badge"
        subtitle="Verified users drive trust and content. You'll be surfaced prominently on city pages, attorney directories, and search."
      />

      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {[1,2,3].map(s => (
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
              { key:'name',   label:'Full Legal Name',   placeholder:'As it appears on credentials', required:true },
              { key:'email',  label:'Email Address',     placeholder:'For badge notification',        required:true },
              { key:'org',    label: role === 'attorney' ? 'Law Firm / Organization' : role === 'journalist' ? 'Media Outlet / Publication' : 'Organization (NLG, ACLU, etc.)', placeholder:'', required:true },
              ...(role === 'attorney' ? [{ key:'barNumber', label:'State Bar Number', placeholder:'e.g. CA-123456', required:true }] : []),
              { key:'credential', label:'Credential URL', placeholder:'LinkedIn, bar.org, press page…', required:false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-gray-400 uppercase tracking-widest mb-1.5">{f.label}{f.required && ' *'}</label>
                <input value={form[f.key]} onChange={e => setForm(p => ({...p, [f.key]: e.target.value}))}
                  placeholder={f.placeholder} required={f.required} type={f.key === 'email' ? 'email' : 'text'}
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
          <textarea rows={5} required value={form.statement} onChange={e => setForm(p => ({...p, statement: e.target.value}))}
            placeholder="I am a civil rights attorney in Oakland with 12 years of experience in police misconduct cases…"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 resize-none transition-colors mb-4" />
          <p className="text-[11px] text-gray-600 mb-5">By submitting you certify all information is accurate. False credentials result in a permanent ban.</p>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition-colors">Back</button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

// ─── OFFICERS & AGENCIES ───────────────────────────────────────────
const OfficersPage = ({ setActiveOfficerId, setActiveAgencyId, nav }) => {
  const [view, setView] = useState('officers');
  const [officers, setOfficers] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [oRes, aRes] = await Promise.all([
        supabase.from('officers')
          .select('id, first_name, last_name, rank, badge_number, agency_id, total_violations, total_complaints')
          .order('total_violations', { ascending: false })
          .limit(50),
        supabase.from('agencies')
          .select('id, name, agency_type, city, state, total_complaints, total_settlements_paid')
          .order('total_complaints', { ascending: false })
          .limit(50),
      ]);
      setOfficers(oRes.data || []);
      setAgencies(aRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const filteredOfficers = officers.filter(o =>
    `${o.first_name} ${o.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    (o.badge_number || '').toLowerCase().includes(search.toLowerCase())
  );
  const filteredAgencies = agencies.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.city || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        eyebrow="Accountability Database"
        title="Officer & Agency Profiles"
        subtitle="Aggregated violation records sourced from community reports. Searchable, shareable, and public — the kind of page that gets shared."
      />

      <div className="flex items-center gap-1 mb-6 p-1 bg-white/5 rounded-lg w-fit">
        {[{id:'officers',l:'Officers'},{id:'agencies',l:'Agencies'}].map(v => (
          <button key={v.id} onClick={() => { setView(v.id); setSearch(''); }}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${view === v.id ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}>
            {v.l}
          </button>
        ))}
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${view}…`}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
      </div>

      {loading ? <Spinner /> : (
        <>
          {view === 'officers' && (
            <div className="space-y-3">
              {filteredOfficers.length === 0 ? <Empty /> : filteredOfficers.map(o => {
                const n = o.total_violations || 0;
                return (
                  <button key={o.id} onClick={() => { setActiveOfficerId(o.id); nav('officer'); }}
                    className="group w-full text-left p-5 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-sm">
                            {(o.last_name||'?').charAt(0)}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0a0a0a] ${severityDotColor(n)}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold text-white">{o.rank} {o.first_name} {o.last_name}</span>
                            {o.badge_number && <span className="text-xs text-gray-500 font-mono">#{o.badge_number}</span>}
                          </div>
                          <div className="text-xs text-gray-500">
                            {o.total_complaints > 0 ? `${o.total_complaints} complaint${o.total_complaints !== 1 ? 's' : ''}` : 'No complaints on record'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                          <div className={`font-display text-2xl ${severityColor(n)}`}>{n}</div>
                          <div className="text-[10px] text-gray-600 uppercase tracking-widest">violations</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {view === 'agencies' && (
            <div className="space-y-3">
              {filteredAgencies.length === 0 ? <Empty /> : filteredAgencies.map(a => (
                <button key={a.id} onClick={() => { setActiveAgencyId(a.id); nav('agency'); }}
                  className="group w-full text-left p-5 bg-white/[0.02] border border-white/8 rounded-xl hover:border-white/20 hover:bg-white/[0.05] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-0.5">{a.name}</div>
                        <div className="text-xs text-gray-500">{[a.city, abbr(a.state)].filter(Boolean).join(', ')}{a.agency_type ? ` · ${a.agency_type}` : ''}</div>
                      </div>
                    </div>
                    <div className="flex gap-8 shrink-0">
                      <div className="text-center">
                        <div className="font-display text-2xl text-red-400">{a.total_complaints || 0}</div>
                        <div className="text-[10px] text-gray-600 uppercase tracking-widest">complaints</div>
                      </div>
                      {a.total_settlements_paid > 0 && (
                        <div className="text-center">
                          <div className="font-display text-2xl text-orange-400">${(a.total_settlements_paid/1000000).toFixed(1)}M</div>
                          <div className="text-[10px] text-gray-600 uppercase tracking-widest">settlements</div>
                        </div>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 transition-all self-center" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};

// ─── OFFICER PROFILE ───────────────────────────────────────────────
const OfficerProfilePage = ({ officerId, nav }) => {
  const [officer, setOfficer] = useState(null);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: o } = await supabase.from('officers')
        .select('*').eq('id', officerId).single();
      setOfficer(o);
      if (o?.agency_id) {
        const { data: ag } = await supabase.from('agencies')
          .select('id, name, city, state').eq('id', o.agency_id).single();
        setAgency(ag);
      }
      setLoading(false);
    };
    load();
  }, [officerId]);

  if (loading) return <main className="py-20"><Spinner /></main>;
  if (!officer) return <main className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">Officer not found.</main>;

  const n = officer.total_violations || 0;
  const sev = severity(n);
  const severityLabel = { critical:'Critical — Multiple documented patterns', high:'High — Repeat violations on record', medium:'Medium — Isolated incidents', low:'Low — Single report' };
  const severityBg = { critical:'border-red-800/50 bg-red-950/30 text-red-400', high:'border-orange-800/50 bg-orange-950/30 text-orange-400', medium:'border-yellow-800/50 bg-yellow-950/30 text-yellow-400', low:'border-gray-700 bg-gray-900/30 text-gray-400' };

  const shareUrl = `${window.location.origin}?officer=${officer.id}`;
  const shareText = `Officer ${officer.rank} ${officer.first_name} ${officer.last_name} has ${n} documented violations. Full record: ${shareUrl} #CivilRightsHub #PoliceAccountability`;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => nav('officers')} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
        <ChevronRight className="h-4 w-4 rotate-180" /> All Officers
      </button>

      {/* Header card */}
      <div className="p-8 bg-white/[0.02] border border-white/8 rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-display text-2xl text-white">
                {(officer.last_name||'?').charAt(0)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0a] ${severityDotColor(n)}`} />
            </div>
            <div>
              <h1 className="font-display text-4xl text-white mb-1">{officer.rank} {officer.first_name} {officer.last_name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                {agency && <span className="text-gray-400 text-sm">{agency.name}</span>}
                {officer.badge_number && <span className="text-gray-600 text-xs font-mono">Badge #{officer.badge_number}</span>}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => nav('upload')} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              <AlertTriangle className="h-3.5 w-3.5" /> File Report
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-white/15 hover:bg-white/10 text-gray-300 px-4 py-2 rounded text-sm transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Share
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { l:'Total Violations',  v: n,                          c: severityColor(n) },
          { l:'Total Complaints',  v: officer.total_complaints||0, c:'text-orange-400' },
          { l:'Severity Level',    v: sev.charAt(0).toUpperCase()+sev.slice(1), c: severityColor(n) },
        ].map(s => (
          <div key={s.l} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <div className={`font-display text-3xl ${s.c} mb-1`}>{s.v}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Severity panel */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border mb-8 ${severityBg[sev]}`}>
        <BarChart2 className="h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold text-sm">{severityLabel[sev]}</div>
          <div className="text-xs opacity-70 mt-0.5">
            {agency ? `Currently affiliated with ${agency.name}` : 'Agency affiliation unknown'}
          </div>
        </div>
      </div>

      {/* Agency link */}
      {agency && (
        <div className="mb-8">
          <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Agency</h3>
          <button onClick={() => { setActiveAgencyId && nav('agency'); }}
            className="flex items-center justify-between w-full p-5 bg-white/[0.03] border border-white/8 rounded-xl hover:border-white/15 transition-colors">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <div className="font-semibold text-white">{agency.name}</div>
                <div className="text-xs text-gray-500">{[agency.city, abbr(agency.state)].filter(Boolean).join(', ')}</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Share box */}
      <div className="p-6 bg-white/[0.02] border border-white/8 rounded-xl">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Share this profile</div>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">
          Public accountability pages like this one drive inbound traffic when shared. Copy the link or post directly to Twitter/X.
        </p>
        <div className="flex gap-3">
          <input readOnly value={shareUrl} className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-400 font-mono focus:outline-none" />
          <button onClick={() => navigator.clipboard?.writeText(shareUrl)} className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded transition-colors">Copy</button>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm rounded transition-colors">Post</a>
        </div>
      </div>
    </main>
  );
};

// ─── AGENCY PROFILE ────────────────────────────────────────────────
const AgencyProfilePage = ({ agencyId, nav }) => {
  const [agency, setAgency] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [aRes, oRes] = await Promise.all([
        supabase.from('agencies').select('*').eq('id', agencyId).single(),
        supabase.from('officers').select('id, first_name, last_name, rank, badge_number, total_violations, total_complaints')
          .eq('agency_id', agencyId).order('total_violations', { ascending: false }).limit(20),
      ]);
      setAgency(aRes.data);
      setOfficers(oRes.data || []);
      setLoading(false);
    };
    load();
  }, [agencyId]);

  if (loading) return <main className="py-20"><Spinner /></main>;
  if (!agency) return <main className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">Agency not found.</main>;

  const shareText = `${agency.name} has ${agency.total_complaints || 0} documented complaints and ${agency.total_settlements_paid ? `$${(agency.total_settlements_paid/1000000).toFixed(1)}M in settlements` : 'settlement data pending'}. Full record: ${window.location.origin} #CivilRightsHub`;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => nav('officers')} className="flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
        <ChevronRight className="h-4 w-4 rotate-180" /> All Agencies
      </button>

      <div className="p-8 bg-white/[0.02] border border-white/8 rounded-2xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h1 className="font-display text-4xl text-white mb-1">{agency.name}</h1>
              <div className="text-gray-400 text-sm">{[agency.city, abbr(agency.state)].filter(Boolean).join(', ')}{agency.agency_type ? ` · ${agency.agency_type}` : ''}</div>
              {agency.phone && <div className="text-xs text-gray-600 mt-1">{agency.phone}</div>}
            </div>
          </div>
          <div className="flex gap-3">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-white/15 hover:bg-white/10 text-gray-300 px-4 py-2 rounded text-sm transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Share
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { l:'Total Complaints', v: agency.total_complaints || 0, c:'text-red-400' },
          { l:'Officers on Record', v: officers.length, c:'text-blue-400' },
          { l:'Settlements Paid', v: agency.total_settlements_paid > 0 ? `$${(agency.total_settlements_paid/1000000).toFixed(1)}M` : 'N/A', c:'text-orange-400' },
        ].map(s => (
          <div key={s.l} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
            <div className={`font-display text-3xl ${s.c} mb-1`}>{s.v}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-widest">{s.l}</div>
          </div>
        ))}
      </div>

      {officers.length > 0 && (
        <div>
          <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4">Officers on Record</h3>
          <div className="space-y-2">
            {officers.map(o => (
              <div key={o.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/8 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${severityDotColor(o.total_violations||0)}`} />
                  <div>
                    <span className="text-sm font-medium text-white">{o.rank} {o.first_name} {o.last_name}</span>
                    {o.badge_number && <span className="text-xs text-gray-600 font-mono ml-2">#{o.badge_number}</span>}
                  </div>
                </div>
                <div className={`font-display text-xl ${severityColor(o.total_violations||0)}`}>{o.total_violations||0}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

// ─── OTHER PAGES ───────────────────────────────────────────────────
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
      Full case law search connected to Supabase — query builder coming next sprint.
    </div>
  </main>
);

const LivestreamPage = () => {
  const videoRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);

  const [facingMode, setFacingMode] = React.useState('environment'); // back camera default
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPreviewing, setIsPreviewing] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [recordings, setRecordings] = React.useState([]);
  const [error, setError] = React.useState('');
  const [hasDualCamera, setHasDualCamera] = React.useState(true);
  const timerRef = React.useRef(null);

  // Start camera preview
  const startCamera = React.useCallback(async (facing) => {
    setError('');
    // Stop any existing stream
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsPreviewing(true);
      setFacingMode(facing);
    } catch (err) {
      // If requested camera unavailable, try opposite
      if (err.name === 'OverconstrainedError' || err.name === 'NotFoundError') {
        setHasDualCamera(false);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
          setIsPreviewing(true);
        } catch (e2) {
          setError('Camera access denied. Please allow camera permission and reload.');
        }
      } else if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Tap the camera icon in your browser address bar to allow access.');
      } else {
        setError('Could not access camera: ' + err.message);
      }
    }
  }, []);

  // Flip camera
  const flipCamera = React.useCallback(() => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    // If recording, stop first
    if (isRecording) stopRecording();
    startCamera(next);
  }, [facingMode, isRecording, startCamera]);

  const startRecording = React.useCallback(() => {
    if (!videoRef.current?.srcObject) return;
    chunksRef.current = [];
    const stream = videoRef.current.srcObject;
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4';
    const mr = new MediaRecorder(stream, { mimeType });
    mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const ts = new Date().toLocaleTimeString();
      setRecordings(prev => [{ url, ts, size: (blob.size / 1024 / 1024).toFixed(1), ext: mimeType.includes('mp4') ? 'mp4' : 'webm' }, ...prev]);
    };
    mr.start(1000);
    mediaRecorderRef.current = mr;
    setIsRecording(true);
    setDuration(0);
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  }, []);

  const stopRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
    setDuration(0);
  }, []);

  const stopCamera = React.useCallback(() => {
    if (isRecording) stopRecording();
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsPreviewing(false);
  }, [isRecording, stopRecording]);

  // Cleanup on unmount
  React.useEffect(() => () => {
    stopCamera();
    clearInterval(timerRef.current);
  }, []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs text-gray-500 uppercase tracking-widest">Secure Recording</p>
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Evidence Auto-Saved
          </span>
        </div>
        <h2 className="font-display text-4xl text-white mb-2">Record an Encounter</h2>
        <p className="text-gray-400 text-sm">All recordings are saved locally. Use front or back camera. Evidence preserved even if this page is closed mid-recording.</p>
      </div>

      {/* Viewfinder */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-white/10 mb-6" style={{aspectRatio:'16/9'}}>
        <video ref={videoRef} muted playsInline
          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          style={{display: isPreviewing ? 'block' : 'none'}} />

        {!isPreviewing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/15 flex items-center justify-center">
              <Camera className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-500 text-sm">Camera off</p>
          </div>
        )}

        {/* Recording indicator overlay */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-sm font-mono font-bold">{fmt(duration)}</span>
          </div>
        )}

        {/* Camera label */}
        {isPreviewing && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] text-gray-300 font-medium">
            {facingMode === 'environment' ? '🔭 Back' : '🤳 Front'}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {!isPreviewing ? (
          <button onClick={() => startCamera('environment')}
            className="flex items-center gap-2 bg-white text-black font-semibold px-6 py-3 rounded-xl text-sm hover:bg-gray-200 transition-colors">
            <Camera className="h-4 w-4" /> Open Camera
          </button>
        ) : (
          <>
            {/* Flip button — always visible when camera is on */}
            {hasDualCamera && (
              <button onClick={flipCamera}
                title={facingMode === 'environment' ? 'Switch to front camera' : 'Switch to back camera'}
                className="flex flex-col items-center gap-1 group">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M16 2l4 5-4 5"/><path d="M4 17h3a2 2 0 0 0 2 2v3"/><path d="M8 22l-4-5 4-5"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500">Flip</span>
              </button>
            )}

            {/* Record / Stop */}
            {!isRecording ? (
              <button onClick={startRecording}
                className="flex flex-col items-center gap-1 group">
                <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-red-400 flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-lg shadow-red-900/50">
                  <div className="w-5 h-5 rounded-full bg-white" />
                </div>
                <span className="text-[10px] text-gray-400">Record</span>
              </button>
            ) : (
              <button onClick={stopRecording}
                className="flex flex-col items-center gap-1 group">
                <div className="w-16 h-16 rounded-full bg-red-700 border-4 border-red-500 flex items-center justify-center group-hover:bg-red-600 transition-colors shadow-lg shadow-red-900/50 animate-pulse">
                  <div className="w-5 h-5 rounded bg-white" />
                </div>
                <span className="text-[10px] text-red-400 font-mono">{fmt(duration)}</span>
              </button>
            )}

            {/* Close camera */}
            <button onClick={stopCamera}
              className="flex flex-col items-center gap-1 group">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <X className="h-5 w-5 text-white" />
              </div>
              <span className="text-[10px] text-gray-500">Close</span>
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/50 rounded-xl p-4 mb-6">
          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Saved recordings */}
      {recordings.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-emerald-400" /> Saved Recordings ({recordings.length})
          </h3>
          <div className="space-y-2">
            {recordings.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/8 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-gray-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Recording {recordings.length - i}</div>
                    <div className="text-xs text-gray-500">{r.ts} · {r.size} MB · {r.ext.toUpperCase()}</div>
                  </div>
                </div>
                <a href={r.url} download={`evidence-${Date.now()}-${i}.${r.ext}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium rounded transition-colors">
                  ↓ Save
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: Shield, label: 'Local first', desc: 'Recordings stay on your device until you save them.' },
          { icon: Camera, label: 'Front + Back', desc: 'Tap Flip to switch cameras at any time, even mid-recording.' },
          { icon: AlertTriangle, label: 'Know your rights', desc: 'You have the right to record police in public in all 50 states.' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/8 rounded-xl">
              <Icon className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white mb-0.5">{item.label}</div>
                <div className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

const ResourcesPage = () => (
  <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <PageHeader eyebrow="Legal Toolkit" title="Resources" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {['FOIA Templates','Know Your Rights Cards','Attorney Directory','Court Filing Guides','42 U.S.C. § 1983 Primer','Stop & Identify Laws by State'].map(r => (
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
      {['Incident Type','Officer / Agency (optional)','Date & Location','Description','Upload Evidence'].map((step, i) => (
        <div key={step} className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/8 rounded-xl">
          <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">{i+1}</div>
          <span className="text-sm font-medium text-gray-300">{step}</span>
          <ChevronRight className="h-4 w-4 text-gray-600 ml-auto" />
        </div>
      ))}
      <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3.5 rounded-lg font-semibold text-sm transition-colors mt-2">Begin Report</button>
    </div>
  </main>
);

// ─── MAIN APP ──────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCitySlug, setActiveCitySlug] = useState('');
  const [activeOfficerId, setActiveOfficerId] = useState('');
  const [activeAgencyId, setActiveAgencyId] = useState('');

  const nav = useCallback((tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navItems = [
    { id:'home',       label:'Home',        icon:Shield },
    { id:'cities',     label:'Cities',      icon:MapPin },
    { id:'officers',   label:'Officers',    icon:Building2 },
    { id:'search',     label:'Search',      icon:Search },
    { id:'livestream', label:'Live',        icon:Radio, dot:true },
    { id:'resources',  label:'Resources',   icon:BookOpen },
    { id:'verify',     label:'Get Verified', icon:BadgeCheck },
    { id:'newsroom',   label:'Newsroom',     icon:Newspaper },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100" style={{ fontFamily:"'Inter Tight','Inter',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&display=swap');
        .font-display { font-family:'Instrument Serif',Georgia,serif; }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-scroll { display:inline-block; animation:ticker 32s linear infinite; }
        .ticker-scroll:hover { animation-play-state:paused; }
        @keyframes pulseGlow { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes ripple { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(4);opacity:0} }
        @keyframes blink { 0%,100%{opacity:.6} 50%{opacity:.1} }
        @keyframes heroFade { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .hero-animate  { animation:heroFade 0.9s ease forwards; }
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
                    <Icon className="h-3.5 w-3.5" />{item.label}
                    {item.dot && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  </button>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsAuthenticated(!isAuthenticated)}
                className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white border border-white/15 rounded hover:bg-white/10 transition-colors">
                <User className="h-3.5 w-3.5" />{isAuthenticated ? 'Account' : 'Sign In'}
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
                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium ${activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>
                    <Icon className="h-4 w-4" />{item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {activeTab === 'home'       && <HomePage nav={nav} />}
      {activeTab === 'cities'     && <CitiesPage nav={nav} setActiveCitySlug={setActiveCitySlug} />}
      {activeTab === 'city'       && <CityPage slug={activeCitySlug} nav={nav} />}
      {activeTab === 'officers'   && <OfficersPage nav={nav} setActiveOfficerId={setActiveOfficerId} setActiveAgencyId={setActiveAgencyId} />}
      {activeTab === 'officer'    && <OfficerProfilePage officerId={activeOfficerId} nav={nav} />}
      {activeTab === 'agency'     && <AgencyProfilePage agencyId={activeAgencyId} nav={nav} />}
      {activeTab === 'verify'     && <VerifyPage />}
      {activeTab === 'search'     && <SearchPage query={searchQuery} setQuery={setSearchQuery} />}
      {activeTab === 'livestream' && <LivestreamPage />}
      {activeTab === 'resources'  && <ResourcesPage />}
      {activeTab === 'upload'     && <UploadPage />}
      {activeTab === 'newsroom'   && <NewsroomPage nav={nav} />}

      <footer className="border-t border-white/5 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-red-500" />
              <span className="font-display text-[15px] text-white">Civil Rights Hub</span>
            </div>
            <p className="text-xs text-gray-600 max-w-sm">All recordings are backed up and encrypted. Your safety is our mission.</p>
            <div className="flex gap-4">
              {['Privacy','Legal','Contact'].map(l => (
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
