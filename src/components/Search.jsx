import { useEffect, useState, useRef } from 'react';
import { Search as SearchIcon, Filter, X, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CaseCard } from './CaseCard';
import { useToast } from '../context/ToastContext';

export function Search() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    court: '',
    yearStart: '',
    yearEnd: '',
    sortBy: 'relevance'
  });
  const searchInputRef = useRef(null);
  const toast = useToast();
  
  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  async function runSearch(query, searchFilters = filters) {
    if (!query.trim()) { 
      setItems([]); 
      return; 
    }
    
    setLoading(true); 
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        q: query
      });
      
      // Add filters if they exist
      if (searchFilters.court) params.append('court', searchFilters.court);
      if (searchFilters.yearStart) params.append('year_start', searchFilters.yearStart);
      if (searchFilters.yearEnd) params.append('year_end', searchFilters.yearEnd);
      if (searchFilters.sortBy) params.append('sort', searchFilters.sortBy);
      
      const res = await fetch(`/api/search?${params.toString()}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data?.error || 'Search failed');
      
      setItems(data.items || []);
      
      // Show toast notification with result count
      if (data.items?.length > 0) {
        toast.info(`Found ${data.items.length} results`);
      } else {
        toast.info('No results found');
      }
    } catch (err) { 
      setError(err.message || String(err));
      toast.error(`Search error: ${err.message || 'Unknown error'}`);
    } finally { 
      setLoading(false); 
    }
  }
  
  // Debounced search
  useEffect(() => { 
    const id = setTimeout(() => {
      if (q.trim()) {
        runSearch(q);
      }
    }, 350); 
    return () => clearTimeout(id); 
  }, [q]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    runSearch(q, filters);
    // Close filter panel on mobile
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      court: '',
      yearStart: '',
      yearEnd: '',
      sortBy: 'relevance'
    });
    runSearch(q, {
      court: '',
      yearStart: '',
      yearEnd: '',
      sortBy: 'relevance'
    });
  };
  
  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-4 pb-12">
      <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input 
              ref={searchInputRef}
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search civil rights opinions, e.g., 'first amendment'…" 
              aria-label="Search cases" 
              className="pl-10"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => runSearch(q)}
              disabled={loading}
              className="md:w-auto w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
            <Button 
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Toggle filters"
              className="md:w-auto w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Filters panel */}
        {showFilters && (
          <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700 animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="court" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Court
                </label>
                <select
                  id="court"
                  name="court"
                  value={filters.court}
                  onChange={handleFilterChange}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <option value="">All Courts</option>
                  <option value="scotus">Supreme Court</option>
                  <option value="ca1">1st Circuit</option>
                  <option value="ca2">2nd Circuit</option>
                  <option value="ca3">3rd Circuit</option>
                  <option value="ca4">4th Circuit</option>
                  <option value="ca5">5th Circuit</option>
                  <option value="ca6">6th Circuit</option>
                  <option value="ca7">7th Circuit</option>
                  <option value="ca8">8th Circuit</option>
                  <option value="ca9">9th Circuit</option>
                  <option value="ca10">10th Circuit</option>
                  <option value="ca11">11th Circuit</option>
                  <option value="cadc">D.C. Circuit</option>
                </select>
              </div>
              <div>
                <label htmlFor="yearStart" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  From Year
                </label>
                <Input
                  id="yearStart"
                  name="yearStart"
                  type="number"
                  min="1700"
                  max={new Date().getFullYear()}
                  value={filters.yearStart}
                  onChange={handleFilterChange}
                  placeholder="e.g., 1990"
                />
              </div>
              <div>
                <label htmlFor="yearEnd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  To Year
                </label>
                <Input
                  id="yearEnd"
                  name="yearEnd"
                  type="number"
                  min="1700"
                  max={new Date().getFullYear()}
                  value={filters.yearEnd}
                  onChange={handleFilterChange}
                  placeholder="e.g., 2023"
                />
              </div>
              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
        
        {loading && !showFilters && (
          <div className="mt-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </div>
        )}
        
        {error && (
          <div className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
            {String(error)}
          </div>
        )}
      </div>
      
      {/* Results count */}
      {!loading && !error && items.length > 0 && (
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Found {items.length} results
        </div>
      )}
      
      {/* Results grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => <CaseCard key={String(item.id)} item={item} />)}
      </div>
      
      {/* No results message */}
      {!loading && !error && items.length === 0 && q && (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">No results found</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Try different keywords or adjust your filters
          </p>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !error && items.length === 0 && !q && (
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Enter a search term to find civil rights cases
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Try searching for terms like "first amendment", "equal protection", or "due process"
          </p>
        </div>
      )}
    </section>
  );
}