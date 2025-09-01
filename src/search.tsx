import * as React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CaseCard, type CaseItem } from "./CaseCard";

export function Search() {
  const [q, setQ] = React.useState("");
  const [items, setItems] = React.useState<CaseItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function runSearch(query: string) {
    if (!query.trim()) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Search failed");
      setItems(data.items ?? []);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  // Debounce
  React.useEffect(() => {
    const id = setTimeout(() => void runSearch(q), 350);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-4">
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search civil rights opinions, e.g., 'first amendment'…" aria-label="Search cases" />
          <Button onClick={() => runSearch(q)} disabled={loading}>Search</Button>
        </div>
        {loading && <p className="mt-3 text-sm text-gray-600">Searching…</p>}
        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((it) => (
          <CaseCard key={String(it.id)} item={it} />
        ))}
      </div>

      {!loading && !error && items.length === 0 && q && (
        <p className="mt-6 text-sm text-gray-600">No results. Try different keywords.</p>
      )}
    </section>
  );
}