// ─── NEWSROOM PAGE ─────────────────────────────────────────────────
// Pulled from WTP News (wtpnews.org) — Matthew Reardon's investigations
// Stories stored in Supabase newsroom_stories table

import React, { useState, useEffect } from 'react';
import {
  ExternalLink, ChevronRight, Newspaper, Filter,
  AlertTriangle, FileText, Scale, Search, Radio,
  BookOpen, Clock, CheckCircle2, Loader2, BadgeCheck,
  Flame, TrendingUp, MapPin
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://vrdnrbjnitptxrexdlao.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZG5yYmpuaXRwdHhyZXhkbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NDE0MDksImV4cCI6MjA2MTExNzQwOX0.i7oIv_2mNpVfxf7p9PnA_8zUGXgmUdMJXbMOC9NRDYQ'
);

const CATEGORY_CONFIG = {
  'Investigation': { color: 'text-orange-400 bg-orange-950/50 border-orange-800/50', icon: Search },
  'Violation':     { color: 'text-red-400 bg-red-950/50 border-red-800/50',          icon: AlertTriangle },
  'FOIA':          { color: 'text-blue-400 bg-blue-950/50 border-blue-800/50',        icon: FileText },
  'Court Filing':  { color: 'text-purple-400 bg-purple-950/50 border-purple-800/50', icon: Scale },
  'Lawsuit':       { color: 'text-amber-400 bg-amber-950/50 border-amber-800/50',    icon: Scale },
  'Breaking News': { color: 'text-red-400 bg-red-950/50 border-red-800/50',          icon: Radio },
};

const STATUS_CONFIG = {
  open:     { label: 'Open',     color: 'text-red-400 bg-red-950/40 border-red-800/50' },
  ongoing:  { label: 'Ongoing',  color: 'text-amber-400 bg-amber-950/40 border-amber-800/50' },
  resolved: { label: 'Resolved', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50' },
  archived: { label: 'Archived', color: 'text-gray-400 bg-gray-900/40 border-gray-700' },
};

const AmendmentTag = ({ num }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[11px] font-semibold text-gray-300">{num}</span>
);

const CategoryBadge = ({ cat }) => {
  const cfg = CATEGORY_CONFIG[cat] || { color: 'text-gray-400 bg-white/5 border-white/10', icon: FileText };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${cfg.color}`}>
      <Icon className="h-3 w-3" />{cat}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${cfg.color}`}>
      {status === 'open' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
      {status === 'resolved' && <CheckCircle2 className="h-3 w-3" />}
      {cfg.label}
    </span>
  );
};

const NewsroomPage = ({ nav }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('newsroom_stories')
        .select('*')
        .order('published_date', { ascending: false });
      setStories(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const categories = ['all', ...Array.from(new Set(stories.map(s => s.category).filter(Boolean)))];

  const filtered = stories.filter(s => {
    if (activeFilter !== 'all' && s.category !== activeFilter) return false;
    if (activeStatus !== 'all' && s.status !== activeStatus) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !(s.summary||'').toLowerCase().includes(search.toLowerCase()) &&
        !(s.tags||[]).join(' ').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featured = filtered.filter(s => s.featured);
  const regular = filtered.filter(s => !s.featured);
  const openCount = stories.filter(s => s.status === 'open').length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest">WTP News · Civil Rights Hub</p>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {openCount} Open Investigations
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-white mb-3">Newsroom</h2>
        <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
          Active investigations, documented violations, FOIA battles, and court filings — sourced directly from{' '}
          <a href="https://wtpnews.org" target="_blank" rel="noopener noreferrer"
            className="text-white hover:text-red-400 transition-colors underline underline-offset-2">WTP News</a>{' '}
          and updated as cases develop.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          { label: 'Total Stories', value: stories.length, icon: Newspaper, color: 'text-white' },
          { label: 'Open Cases', value: stories.filter(s=>s.status==='open').length, icon: AlertTriangle, color: 'text-red-400' },
          { label: 'FOIA Filed', value: stories.filter(s=>s.category==='FOIA').length, icon: FileText, color: 'text-blue-400' },
          { label: 'In Court', value: stories.filter(s=>s.category==='Court Filing'||s.category==='Lawsuit').length, icon: Scale, color: 'text-purple-400' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4 flex items-center gap-3">
              <Icon className={`h-5 w-5 shrink-0 ${s.color}`} />
              <div>
                <div className={`font-display text-2xl ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-widest">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search investigations…"
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/25 transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Category filter */}
          {categories.map(c => (
            <button key={c} onClick={() => setActiveFilter(c)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors capitalize ${
                activeFilter === c ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}>
              {c === 'all' ? 'All Types' : c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['all','open','resolved'].map(s => (
            <button key={s} onClick={() => setActiveStatus(s)}
              className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors capitalize ${
                activeStatus === s ? (s === 'open' ? 'bg-red-700 text-white' : s === 'resolved' ? 'bg-emerald-700 text-white' : 'bg-white text-black') : 'bg-white/5 text-gray-400 hover:text-white'
              }`}>
              {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">No stories match your filter.</div>
      ) : (
        <>
          {/* Featured stories — hero grid */}
          {featured.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Featured Investigations</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featured.map((story, i) => (
                  <a key={story.id} href={story.source_url} target="_blank" rel="noopener noreferrer"
                    className={`group block p-6 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all ${i === 0 ? 'md:col-span-2' : ''}`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <CategoryBadge cat={story.category} />
                        <StatusBadge status={story.status} />
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-white shrink-0 transition-colors" />
                    </div>

                    <h3 className={`font-display text-white leading-tight mb-3 group-hover:text-red-300 transition-colors ${i === 0 ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
                      {story.title}
                    </h3>

                    <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{story.summary}</p>

                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {(story.amendment || []).map(a => <AmendmentTag key={a} num={a} />)}
                        {(story.tags || []).slice(0, 3).map(t => (
                          <span key={t} className="text-[11px] text-gray-600 bg-white/[0.03] border border-white/8 px-2 py-0.5 rounded">#{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                        {story.location_city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{story.location_city}, {story.location_state}
                          </span>
                        )}
                        {story.published_date && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(story.published_date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-red-500/80">
                          <BadgeCheck className="h-3 w-3" />{story.source_name}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Regular stories — list */}
          {regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">All Stories</span>
                </div>
              )}
              <div className="space-y-3">
                {regular.map(story => (
                  <a key={story.id} href={story.source_url} target="_blank" rel="noopener noreferrer"
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <CategoryBadge cat={story.category} />
                        <StatusBadge status={story.status} />
                        {story.location_city && (
                          <span className="text-[11px] text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{story.location_city}
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-white text-sm leading-snug mb-1 group-hover:text-red-300 transition-colors line-clamp-2">
                        {story.title}
                      </div>
                      <div className="text-[12px] text-gray-500 line-clamp-1">{story.summary}</div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex gap-1.5 flex-wrap">
                        {(story.amendment || []).map(a => <AmendmentTag key={a} num={a} />)}
                      </div>
                      {story.published_date && (
                        <span className="text-[11px] text-gray-600 whitespace-nowrap">
                          {new Date(story.published_date).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                        </span>
                      )}
                      <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Footer attribution */}
          <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-white mb-1">Source: We The People News</div>
              <p className="text-xs text-gray-500">All stories sourced from independent investigative journalism by Matthew Reardon. Full reports at wtpnews.org.</p>
            </div>
            <a href="https://wtpnews.org" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded text-sm font-medium transition-colors shrink-0">
              <ExternalLink className="h-3.5 w-3.5" /> Visit WTP News
            </a>
          </div>
        </>
      )}
    </main>
  );
};

export { NewsroomPage };
