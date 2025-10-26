import React, { useState } from 'react';
import { 
  ChevronDown, 
  MapPin, 
  Calendar, 
  Tag, 
  BookOpen, 
  Scale,
  AlertTriangle
} from 'lucide-react';

const SearchFilters = ({ circuit, onCircuitChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    circuits: true,
    dates: false,
    courts: false,
    issues: false
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Circuit data with hostility levels
  const circuits = [
    { id: '1', name: '1st Circuit', hostility: 'Protective', states: 'ME, MA, NH, RI, PR' },
    { id: '2', name: '2nd Circuit', hostility: 'Protective', states: 'CT, NY, VT' },
    { id: '3', name: '3rd Circuit', hostility: 'Moderate', states: 'DE, NJ, PA, VI' },
    { id: '4', name: '4th Circuit', hostility: 'Protective', states: 'MD, NC, SC, VA, WV' },
    { id: '5', name: '5th Circuit', hostility: 'EXTREMELY HOSTILE', states: 'LA, MS, TX' },
    { id: '6', name: '6th Circuit', hostility: 'Moderate', states: 'KY, MI, OH, TN' },
    { id: '7', name: '7th Circuit', hostility: 'Moderate', states: 'IL, IN, WI' },
    { id: '8', name: '8th Circuit', hostility: 'Moderate', states: 'AR, IA, MN, MO, NE, ND, SD' },
    { id: '9', name: '9th Circuit', hostility: 'Protective', states: 'AK, AZ, CA, HI, ID, MT, NV, OR, WA, GU, NMI' },
    { id: '10', name: '10th Circuit', hostility: 'Moderate', states: 'CO, KS, NM, OK, UT, WY' },
    { id: '11', name: '11th Circuit', hostility: 'Moderate', states: 'AL, FL, GA' },
    { id: 'dc', name: 'D.C. Circuit', hostility: 'Protective', states: 'DC' },
    { id: 'fed', name: 'Federal Circuit', hostility: 'Moderate', states: 'Nationwide' }
  ];

  // Constitutional issues
  const constitutionalIssues = [
    { id: 'first', name: 'First Amendment' },
    { id: 'fourth', name: 'Fourth Amendment' },
    { id: 'fifth', name: 'Fifth Amendment' },
    { id: 'sixth', name: 'Sixth Amendment' },
    { id: 'eighth', name: 'Eighth Amendment' },
    { id: 'fourteenth', name: 'Fourteenth Amendment' }
  ];

  // Courts
  const courts = [
    { id: 'scotus', name: 'Supreme Court' },
    { id: 'appeals', name: 'Circuit Courts of Appeals' },
    { id: 'district', name: 'District Courts' },
    { id: 'state', name: 'State Supreme Courts' }
  ];

  // Date ranges
  const dateRanges = [
    { id: 'last-year', name: 'Last Year' },
    { id: 'last-5-years', name: 'Last 5 Years' },
    { id: 'last-10-years', name: 'Last 10 Years' },
    { id: 'last-20-years', name: 'Last 20 Years' },
    { id: 'all-time', name: 'All Time' }
  ];

  return (
    <div className="space-y-6">
      {/* Circuit Filter */}
      <div>
        <button
          onClick={() => toggleSection('circuits')}
          className="w-full flex items-center justify-between mb-2 text-white"
        >
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-primary-400" />
            <span className="font-medium">Federal Circuits</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.circuits ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.circuits && (
          <div className="space-y-2 ml-6 mt-3">
            {circuits.map((c) => (
              <div key={c.id} className="flex items-center">
                <button
                  onClick={() => onCircuitChange(c.id)}
                  className={`flex items-center text-left w-full p-2 rounded-md ${
                    circuit === c.id 
                      ? 'bg-primary-900/50 text-primary-300' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <span>{c.name}</span>
                      {c.hostility === 'EXTREMELY HOSTILE' && (
                        <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{c.states}</div>
                  </div>
                  <div>
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      c.hostility === 'Protective' 
                        ? 'bg-green-500' 
                        : c.hostility === 'EXTREMELY HOSTILE'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                    }`}></span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Date Range Filter */}
      <div>
        <button
          onClick={() => toggleSection('dates')}
          className="w-full flex items-center justify-between mb-2 text-white"
        >
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary-400" />
            <span className="font-medium">Date Range</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.dates ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.dates && (
          <div className="space-y-2 ml-6 mt-3">
            {dateRanges.map((range) => (
              <div key={range.id} className="flex items-center">
                <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer">
                  <input
                    type="radio"
                    name="dateRange"
                    value={range.id}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 bg-dark-700"
                  />
                  {range.name}
                </label>
              </div>
            ))}
            
            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-2">Custom Range:</p>
              <div className="flex space-x-2">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">From</label>
                  <input
                    type="number"
                    min="1789"
                    max="2025"
                    placeholder="Year"
                    className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">To</label>
                  <input
                    type="number"
                    min="1789"
                    max="2025"
                    placeholder="Year"
                    className="w-full px-2 py-1 bg-dark-700 border border-dark-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Courts Filter */}
      <div>
        <button
          onClick={() => toggleSection('courts')}
          className="w-full flex items-center justify-between mb-2 text-white"
        >
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-primary-400" />
            <span className="font-medium">Courts</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.courts ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.courts && (
          <div className="space-y-2 ml-6 mt-3">
            {courts.map((court) => (
              <div key={court.id} className="flex items-center">
                <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    value={court.id}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 bg-dark-700 rounded"
                  />
                  {court.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Constitutional Issues Filter */}
      <div>
        <button
          onClick={() => toggleSection('issues')}
          className="w-full flex items-center justify-between mb-2 text-white"
        >
          <div className="flex items-center">
            <Scale className="h-4 w-4 mr-2 text-primary-400" />
            <span className="font-medium">Constitutional Issues</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${expandedSections.issues ? 'rotate-180' : ''}`} />
        </button>
        
        {expandedSections.issues && (
          <div className="space-y-2 ml-6 mt-3">
            {constitutionalIssues.map((issue) => (
              <div key={issue.id} className="flex items-center">
                <label className="flex items-center text-gray-400 hover:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    value={issue.id}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 bg-dark-700 rounded"
                  />
                  {issue.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button (Mobile Only) */}
      <div className="pt-2 lg:hidden">
        <button
          onClick={onClearFilters}
          className="w-full bg-dark-700 hover:bg-dark-600 text-white py-2 rounded-md transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;