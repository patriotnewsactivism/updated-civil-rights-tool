import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  AlertTriangle, 
  ChevronRight, 
  Download,
  Search,
  Scale,
  ExternalLink,
  Home,
  Car,
  Smartphone,
  Briefcase
} from 'lucide-react';

const FourthAmendmentTool = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fourth Amendment landmark cases
  const landmarkCases = [
    {
      id: 'terry-ohio',
      title: 'Terry v. Ohio',
      citation: '392 U.S. 1 (1968)',
      category: 'stops',
      summary: 'Established that police may stop and briefly detain a person if they have reasonable suspicion that the person has committed, is committing, or is about to commit a crime, and may conduct a limited pat-down search for weapons if they have reasonable suspicion that the person is armed and dangerous.',
      significance: 'Created the "stop and frisk" doctrine based on reasonable suspicion',
      hostileCircuits: ['5th Circuit'],
      keyPoints: [
        'Police need "reasonable suspicion" to stop someone briefly',
        'Reasonable suspicion is less than probable cause but more than a hunch',
        'Pat-down searches limited to checking for weapons for officer safety',
        'Cannot search for evidence without probable cause'
      ]
    },
    {
      id: 'katz-united-states',
      title: 'Katz v. United States',
      citation: '389 U.S. 347 (1967)',
      category: 'privacy',
      summary: 'Established that the Fourth Amendment protects people, not places, and that what a person seeks to preserve as private, even in a public place, may be constitutionally protected. Introduced the "reasonable expectation of privacy" test.',
      significance: 'Created the "reasonable expectation of privacy" test',
      hostileCircuits: [],
      keyPoints: [
        'Fourth Amendment protects people, not just places',
        'Two-part test: 1) person exhibited actual expectation of privacy, 2) society recognizes that expectation as reasonable',
        'Overturned previous "trespass doctrine"',
        'Applies to electronic surveillance and digital communications'
      ]
    },
    {
      id: 'riley-california',
      title: 'Riley v. California',
      citation: '573 U.S. 373 (2014)',
      category: 'digital',
      summary: 'Held that police generally may not search digital information on a cell phone seized from an arrestee without a warrant, recognizing the vast amount of personal data contained on modern cell phones.',
      significance: 'Requires warrant to search cell phones, even incident to arrest',
      hostileCircuits: [],
      keyPoints: [
        'Cell phones contain vast amounts of private information requiring warrant protection',
        'Search incident to arrest exception does not apply to digital data',
        'Recognizes unique privacy concerns in digital age',
        'Applies to smartphones, tablets, and other digital devices'
      ]
    },
    {
      id: 'carpenter-united-states',
      title: 'Carpenter v. United States',
      citation: '585 U.S. ___ (2018)',
      category: 'digital',
      summary: 'Held that the government needs a warrant to access cell phone location records, as individuals have a reasonable expectation of privacy in their physical movements as recorded through cell-site location information.',
      significance: 'Requires warrant for cell phone location data',
      hostileCircuits: [],
      keyPoints: [
        'Government needs warrant to access cell phone location records',
        'People have reasonable expectation of privacy in their physical movements',
        'Third-party doctrine limited for sensitive digital records',
        'Major expansion of privacy rights in digital context'
      ]
    },
    {
      id: 'collins-virginia',
      title: 'Collins v. Virginia',
      citation: '584 U.S. ___ (2018)',
      category: 'home',
      summary: 'Held that the automobile exception to the Fourth Amendment does not permit a police officer to enter the curtilage of a home (driveway) without a warrant to search a vehicle parked there.',
      significance: 'Automobile exception does not extend to home curtilage',
      hostileCircuits: [],
      keyPoints: [
        'Automobile exception does not override home protection',
        'Curtilage (area immediately surrounding home) has strong Fourth Amendment protection',
        'Police need warrant to search vehicle parked at home',
        'Reinforces special protection for the home'
      ]
    },
    {
      id: 'rodriguez-united-states',
      title: 'Rodriguez v. United States',
      citation: '575 U.S. ___ (2015)',
      category: 'stops',
      summary: 'Held that police may not extend a traffic stop beyond the time needed to handle the matter for which the stop was made without additional reasonable suspicion.',
      significance: 'Traffic stops cannot be prolonged without reasonable suspicion',
      hostileCircuits: ['5th Circuit', '8th Circuit'],
      keyPoints: [
        'Traffic stops must be limited to their original purpose',
        'Cannot extend stop for dog sniff without additional reasonable suspicion',
        'Police cannot add unrelated investigations to prolong detention',
        'Protects against pretextual extensions of traffic stops'
      ]
    },
    {
      id: 'birchfield-north-dakota',
      title: 'Birchfield v. North Dakota',
      citation: '579 U.S. ___ (2016)',
      category: 'searches',
      summary: 'Held that the Fourth Amendment permits warrantless breath tests incident to arrests for drunk driving but not warrantless blood tests.',
      significance: 'Distinguishes between breath and blood tests for DUI',
      hostileCircuits: [],
      keyPoints: [
        'Breath tests permissible without warrant incident to DUI arrest',
        'Blood tests require warrant due to greater invasiveness',
        'States cannot criminalize refusal of warrantless blood test',
        'Balances law enforcement needs with privacy interests'
      ]
    }
  ];

  // Filter cases based on search query
  const filteredCases = landmarkCases.filter(caseData => {
    if (!searchQuery) {
      return activeSection === 'overview' || activeSection === 'all' || caseData.category === activeSection;
    }
    
    const query = searchQuery.toLowerCase();
    return (
      (caseData.title.toLowerCase().includes(query) ||
       caseData.summary.toLowerCase().includes(query) ||
       caseData.citation.toLowerCase().includes(query)) &&
      (activeSection === 'overview' || activeSection === 'all' || caseData.category === activeSection)
    );
  });

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSearchQuery('');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Eye className="mr-2 h-6 w-6 text-primary-400" />
          Fourth Amendment Rights
        </h2>
        <p className="text-gray-400">
          Protection against unreasonable searches and seizures
        </p>
      </div>

      {/* Section Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max border-b border-dark-600">
          <button
            onClick={() => handleSectionChange('overview')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'overview'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleSectionChange('stops')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'stops'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Car className="h-4 w-4 mr-2" />
            Stops & Detentions
          </button>
          <button
            onClick={() => handleSectionChange('home')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'home'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Home className="h-4 w-4 mr-2" />
            Home Protection
          </button>
          <button
            onClick={() => handleSectionChange('digital')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'digital'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Digital Privacy
          </button>
          <button
            onClick={() => handleSectionChange('searches')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'searches'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Searches
          </button>
          <button
            onClick={() => handleSectionChange('all')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'all'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            All Cases
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases..."
            className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
      </div>

      {/* Fourth Amendment Text */}
      {activeSection === 'overview' && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 p-5 bg-dark-700 rounded-lg border border-dark-600"
        >
          <h3 className="text-xl font-semibold text-white mb-3">The Fourth Amendment</h3>
          <blockquote className="border-l-4 border-primary-600 pl-4 italic text-gray-300 mb-4">
            "The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized."
          </blockquote>
          <p className="text-gray-400 mb-4">
            The Fourth Amendment protects against unreasonable searches and seizures by the government. It requires warrants to be supported by probable cause and to specifically describe what is being searched or seized. However, courts have recognized numerous exceptions to the warrant requirement.
          </p>
          <div className="flex items-center text-sm text-primary-400 hover:text-primary-300">
            <a href="https://www.law.cornell.edu/constitution/fourth_amendment" target="_blank" rel="noopener noreferrer" className="flex items-center">
              Read more about the Fourth Amendment
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </motion.div>
      )}

      {/* Key Concepts */}
      {activeSection === 'overview' && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="p-5 bg-dark-700 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-3">Probable Cause</h3>
            <p className="text-gray-400 mb-3">
              Probable cause exists when there is a reasonable basis for believing that a crime has been committed or that evidence of a crime is present in the place to be searched.
            </p>
            <p className="text-gray-400">
              It requires more than mere suspicion but less than absolute certainty. Police must have probable cause to obtain a warrant or to make an arrest.
            </p>
          </div>
          
          <div className="p-5 bg-dark-700 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-3">Reasonable Suspicion</h3>
            <p className="text-gray-400 mb-3">
              Reasonable suspicion is a lower standard than probable cause. It requires specific, articulable facts that suggest criminal activity, not just a hunch.
            </p>
            <p className="text-gray-400">
              Police can briefly detain someone based on reasonable suspicion (Terry stop) and may conduct a limited pat-down for weapons if they reasonably believe the person is armed and dangerous.
            </p>
          </div>
          
          <div className="p-5 bg-dark-700 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-3">Warrant Requirement</h3>
            <p className="text-gray-400 mb-3">
              The Fourth Amendment generally requires police to obtain a warrant before conducting searches or seizures, with the warrant specifically describing what is to be searched or seized.
            </p>
            <p className="text-gray-400">
              Warrants must be based on probable cause and approved by a neutral magistrate. However, there are many exceptions to this requirement.
            </p>
          </div>
          
          <div className="p-5 bg-dark-700 rounded-lg border border-dark-600">
            <h3 className="text-lg font-semibold text-white mb-3">Exclusionary Rule</h3>
            <p className="text-gray-400 mb-3">
              Evidence obtained through an illegal search or seizure is generally inadmissible in court under the exclusionary rule.
            </p>
            <p className="text-gray-400">
              This rule serves as a deterrent against police misconduct, though there are exceptions such as good faith, inevitable discovery, and independent source.
            </p>
          </div>
        </motion.div>
      )}

      {/* Common Exceptions */}
      {activeSection === 'overview' && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Common Exceptions to the Warrant Requirement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
              <h4 className="font-medium text-primary-300 mb-2">Consent</h4>
              <p className="text-sm text-gray-400">
                If a person voluntarily consents to a search, no warrant is required. Consent must be given freely and can be limited in scope or withdrawn at any time.
              </p>
            </div>
            
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
              <h4 className="font-medium text-primary-300 mb-2">Plain View</h4>
              <p className="text-sm text-gray-400">
                Police may seize evidence without a warrant if it's in plain view, they are lawfully present, and the incriminating nature is immediately apparent.
              </p>
            </div>
            
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
              <h4 className="font-medium text-primary-300 mb-2">Exigent Circumstances</h4>
              <p className="text-sm text-gray-400">
                Warrantless searches may be justified in emergency situations, such as when evidence might be destroyed, a suspect might escape, or someone is in danger.
              </p>
            </div>
            
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
              <h4 className="font-medium text-primary-300 mb-2">Search Incident to Arrest</h4>
              <p className="text-sm text-gray-400">
                Following a lawful arrest, police may search the arrestee and the area within their immediate control for weapons or evidence without a warrant.
              </p>
            </div>
            
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
              <h4 className="font-medium text-primary-300 mb-2">Automobile Exception</h4>
              <p className="text-sm text-gray-400">
                Due to their mobility, vehicles may be searched without a warrant if there is probable cause to believe they contain evidence of a crime.
              </p>
            </div>
            
            <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
              <h4 className="font-medium text-primary-300 mb-2">Border Searches</h4>
              <p className="text-sm text-gray-400">
                Searches at international borders or their functional equivalents (like airports) may be conducted without a warrant or probable cause.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Case Cards */}
      {(activeSection !== 'overview' || searchQuery) && (
        <div className="space-y-4 mb-8">
          {filteredCases.length > 0 ? (
            filteredCases.map((caseData) => (
              <motion.div
                key={caseData.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-5 rounded-lg border ${
                  caseData.hostileCircuits.length > 0
                    ? 'bg-dark-700/80 border-warning-700/50'
                    : 'bg-dark-700/80 border-dark-600'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{caseData.title}</h3>
                    <p className="text-sm text-gray-400">{caseData.citation}</p>
                  </div>
                  
                  {caseData.hostileCircuits.length > 0 && (
                    <div className="mt-2 md:mt-0 flex items-center bg-warning-900/30 text-warning-400 px-3 py-1 rounded-md text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span>Hostile in: {caseData.hostileCircuits.join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-300 mb-4">{caseData.summary}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-primary-300 mb-2">Key Points:</h4>
                  <ul className="space-y-1">
                    {caseData.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-400">
                        <span className="text-primary-400 mr-2">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-500">
                    <Scale className="h-3 w-3 mr-1" />
                    <span>Significance: {caseData.significance}</span>
                  </div>
                  
                  <a 
                    href={`https://scholar.google.com/scholar_case?case=${encodeURIComponent(caseData.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 text-sm flex items-center"
                  >
                    Read Full Case
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 bg-dark-700 rounded-lg border border-dark-600 text-center">
              <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No cases found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or select a different category.
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Practical Guidance */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Practical Guidance</h3>
          <button className="text-primary-400 hover:text-primary-300 flex items-center text-sm">
            <Download className="h-4 w-4 mr-1" />
            Download Guide
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              If stopped by police
            </h4>
            <p className="text-gray-400 ml-6">
              Stay calm and keep your hands visible. You have the right to remain silent and can refuse to consent to a search, but never physically resist. Clearly state "I do not consent to a search" if asked. Ask if you are free to leave; if yes, calmly walk away.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              If police come to your home
            </h4>
            <p className="text-gray-400 ml-6">
              You do not have to let officers into your home without a warrant, except in emergency situations. If they claim to have a warrant, ask to see it before allowing entry. Step outside and close the door behind you while reviewing the warrant to prevent a "protective sweep."
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              Digital device protection
            </h4>
            <p className="text-gray-400 ml-6">
              Police generally need a warrant to search your phone or computer, even after arrest. You can refuse to provide passwords or biometric unlocking. Consider using strong encryption and disabling biometric unlocking if you're concerned about searches.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              Document the encounter
            </h4>
            <p className="text-gray-400 ml-6">
              You have the right to record police interactions in public places, though you should not interfere with their activities. After any encounter, write down badge numbers, patrol car numbers, which agency the officers were from, and any other details while fresh in your memory.
            </p>
          </div>
        </div>
      </div>

      {/* Circuit Court Warning */}
      <div className="mb-8 p-4 bg-warning-900/30 border border-warning-700/50 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-warning-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-warning-400 mb-2">Circuit Court Variations</h3>
            <p className="text-sm text-gray-300 mb-3">
              Fourth Amendment protections can vary significantly depending on which federal circuit has jurisdiction over your location. The 5th Circuit (Louisiana, Mississippi, Texas) and 8th Circuit (Arkansas, Iowa, Minnesota, Missouri, Nebraska, North Dakota, South Dakota) often apply Fourth Amendment protections more narrowly than other circuits.
            </p>
            <p className="text-sm text-gray-300">
              Be particularly cautious in these jurisdictions, as courts may be more likely to uphold questionable searches and seizures. Always consult with an attorney familiar with the specific circuit's precedents when dealing with Fourth Amendment issues in these areas.
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Additional Resources</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="https://www.aclu.org/know-your-rights/stopped-by-police"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              ACLU: Stopped by Police
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Comprehensive guide to your rights during police encounters.
            </p>
          </a>
          
          <a 
            href="https://www.eff.org/issues/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              EFF: Digital Privacy
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Resources on digital privacy rights and device security.
            </p>
          </a>
          
          <a 
            href="https://www.nacdl.org/Content/FourthAmendmentCenter"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              NACDL Fourth Amendment Center
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Legal resources and case analysis on Fourth Amendment issues.
            </p>
          </a>
          
          <a 
            href="https://www.law.cornell.edu/wex/fourth_amendment"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              Cornell Law: Fourth Amendment
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Detailed legal explanation of Fourth Amendment principles and case law.
            </p>
          </a>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="p-4 bg-warning-900/20 border border-warning-700/30 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-warning-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-warning-400 mb-1">Legal Disclaimer</h3>
            <p className="text-sm text-gray-300">
              This information is provided for educational purposes only and does not constitute legal advice.
              Fourth Amendment law varies by jurisdiction and changes over time. Always consult with a qualified attorney for
              specific legal guidance tailored to your situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FourthAmendmentTool;