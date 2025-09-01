import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  Calendar, 
  Tag, 
  MapPin, 
  BookOpen,
  AlertTriangle,
  X,
  Download,
  Share2
} from 'lucide-react';

// Import components
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import CircuitInfo from './CircuitInfo';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(new URLSearchParams(location.search));
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [circuit, setCircuit] = useState(searchParams.get('circuit') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [circuitInfo, setCircuitInfo] = useState(null);

  // Mock data for circuit information
  const circuitData = {
    '1': { 
      name: '1st Circuit', 
      states: ['ME', 'MA', 'NH', 'RI', 'PR'], 
      hostility: 'Protective',
      keyInfo: 'Strong protections for First Amendment and Fourth Amendment rights.',
      qualifiedImmunity: 'Moderate application, requires clearly established law.',
      section1983: 'Favorable to plaintiffs in civil rights cases.'
    },
    '5': { 
      name: '5th Circuit', 
      states: ['LA', 'MS', 'TX'], 
      hostility: 'EXTREMELY HOSTILE',
      keyInfo: 'Severely restricted constitutional protections, particularly after McKesson v. Doe.',
      qualifiedImmunity: 'Expansive application, nearly impossible to overcome.',
      section1983: 'Highly unfavorable to plaintiffs in civil rights cases.'
    },
    '9': { 
      name: '9th Circuit', 
      states: ['AK', 'AZ', 'CA', 'HI', 'ID', 'MT', 'NV', 'OR', 'WA'], 
      hostility: 'Protective',
      keyInfo: 'Strong protections for civil liberties and constitutional rights.',
      qualifiedImmunity: 'More restrictive application, allows more cases to proceed.',
      section1983: 'Generally favorable to plaintiffs in civil rights cases.'
    }
  };

  // Mock data for search results
  const mockResults = [
    {
      id: 1,
      title: 'NAACP v. Alabama',
      citation: '357 U.S. 449 (1958)',
      court: 'Supreme Court',
      date: '1958-06-30',
      summary: 'Foundation for associational privacy in organizing',
      tags: ['First Amendment', 'Freedom of Association', 'Privacy'],
      relevance: 95
    },
    {
      id: 2,
      title: 'Brandenburg v. Ohio',
      citation: '395 U.S. 444 (1969)',
      court: 'Supreme Court',
      date: '1969-06-09',
      summary: 'Highest protection for political speech unless directed to imminent lawless action',
      tags: ['First Amendment', 'Freedom of Speech', 'Incitement'],
      relevance: 92
    },
    {
      id: 3,
      title: 'Texas v. Johnson',
      citation: '491 U.S. 397 (1989)',
      court: 'Supreme Court',
      date: '1989-06-21',
      summary: 'Flag burning constitutes protected symbolic speech',
      tags: ['First Amendment', 'Symbolic Speech', 'Flag Desecration'],
      relevance: 88
    },
    {
      id: 4,
      title: 'McKesson v. Doe',
      citation: '141 S. Ct. 48 (2020)',
      court: '5th Circuit (after SCOTUS remand)',
      date: '2020-11-02',
      summary: 'Created dangerous liability for protest organizers in the 5th Circuit',
      tags: ['First Amendment', 'Protest Rights', 'Liability'],
      relevance: 97,
      warning: true
    },
    {
      id: 5,
      title: 'Doe v. McKesson',
      citation: '945 F.3d 818 (5th Cir. 2019)',
      court: '5th Circuit',
      date: '2019-12-16',
      summary: 'Imposed liability on protest organizer for actions of unidentified third party',
      tags: ['First Amendment', 'Protest Rights', 'Liability'],
      relevance: 96,
      warning: true
    }
  ];

  // Update URL when search parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (circuit) params.set('circuit', circuit);
    
    navigate({
      pathname: location.pathname,
      search: params.toString()
    }, { replace: true });
  }, [searchQuery, circuit, navigate, location.pathname]);

  // Load circuit info when circuit changes
  useEffect(() => {
    if (circuit && circuitData[circuit]) {
      setCircuitInfo(circuitData[circuit]);
    } else {
      setCircuitInfo(null);
    }
  }, [circuit]);

  // Simulate search results loading
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock results based on search query and circuit
      let filteredResults = [...mockResults];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredResults = filteredResults.filter(result => 
          result.title.toLowerCase().includes(query) || 
          result.summary.toLowerCase().includes(query) ||
          result.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      setResults(filteredResults);
      setTotalResults(filteredResults.length);
      setLoading(false);
    };
    
    performSearch();
  }, [searchQuery, circuit]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    params.set('q', searchQuery);
    setSearchParams(params);
  };

  const handleFilterToggle = () => {
    setFiltersOpen(!filtersOpen);
  };

  const handleCircuitChange = (newCircuit) => {
    setCircuit(newCircuit);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCircuit('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Case Search</h1>
        <p className="text-gray-400">
          Search constitutional rights cases across all federal circuits
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, constitutional issues, or keywords..."
                className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-600 focus:border-primary-600 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-r-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Filters and Results */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Section - Mobile Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={handleFilterToggle}
            className="w-full flex items-center justify-between p-3 bg-dark-800 rounded-lg border border-dark-600 text-white"
          >
            <div className="flex items-center">
              <Filter className="h-5 w-5 mr-2 text-primary-400" />
              <span>Filters</span>
            </div>
            <ChevronDown className={`h-5 w-5 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 p-4 bg-dark-800 rounded-lg border border-dark-600"
            >
              <SearchFilters 
                circuit={circuit}
                onCircuitChange={handleCircuitChange}
                onClearFilters={clearFilters}
              />
            </motion.div>
          )}
        </div>

        {/* Filters Section - Desktop */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-5 border border-dark-700 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                Clear all
              </button>
            </div>
            
            <SearchFilters 
              circuit={circuit}
              onCircuitChange={handleCircuitChange}
              onClearFilters={clearFilters}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="flex-grow">
          {/* Active Filters */}
          {(searchQuery || circuit) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {searchQuery && (
                <div className="flex items-center bg-primary-900/50 text-primary-300 px-3 py-1 rounded-full text-sm">
                  <Search className="h-3 w-3 mr-1" />
                  <span>{searchQuery}</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              {circuit && (
                <div className="flex items-center bg-primary-900/50 text-primary-300 px-3 py-1 rounded-full text-sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{circuitData[circuit]?.name || `Circuit ${circuit}`}</span>
                  <button 
                    onClick={() => setCircuit('')}
                    className="ml-2 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Circuit Info Alert */}
          {circuitInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 p-4 rounded-lg border ${
                circuitInfo.hostility === 'EXTREMELY HOSTILE'
                  ? 'bg-red-900/30 border-red-700/50'
                  : circuitInfo.hostility === 'Protective'
                    ? 'bg-green-900/30 border-green-700/50'
                    : 'bg-blue-900/30 border-blue-700/50'
              }`}
            >
              <CircuitInfo circuitInfo={circuitInfo} />
            </motion.div>
          )}

          {/* Results Count and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="mb-3 sm:mb-0">
              <p className="text-gray-300">
                {loading ? (
                  <span>Searching...</span>
                ) : (
                  <span>Found <span className="font-semibold text-white">{totalResults}</span> results</span>
                )}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-md text-gray-300 text-sm transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-md text-gray-300 text-sm transition-colors">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : results.length > 0 ? (
            <SearchResults results={results} />
          ) : (
            <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-8 border border-dark-700 text-center">
              <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No cases found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or filters to find more results.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Warning for 5th Circuit */}
          {circuit === '5' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 p-4 bg-red-900/30 border border-red-700/50 rounded-lg"
            >
              <div className="flex items-start">
                <AlertTriangle className="h-6 w-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Critical 5th Circuit Warning</h3>
                  <p className="text-gray-300">
                    The 5th Circuit has demonstrated extreme hostility to civil rights protections.
                    Recent decisions like <span className="font-semibold">McKesson v. Doe</span> create dangerous liability for protected First Amendment activity.
                    Exercise heightened caution in Louisiana, Mississippi, and Texas jurisdictions.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPage;