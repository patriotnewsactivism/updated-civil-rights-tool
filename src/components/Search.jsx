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
      const res = await fetch(/api/search?q=);
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
