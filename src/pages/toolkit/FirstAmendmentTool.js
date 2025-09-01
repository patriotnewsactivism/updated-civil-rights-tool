import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookMarked, 
  AlertTriangle, 
  ChevronRight, 
  Download,
  Search,
  MapPin,
  Scale,
  ExternalLink
} from 'lucide-react';

const FirstAmendmentTool = () => {
  const [activeSection, setActiveSection] = useState('speech');
  const [searchQuery, setSearchQuery] = useState('');
  
  // First Amendment landmark cases
  const landmarkCases = [
    {
      id: 'brandenburg',
      title: 'Brandenburg v. Ohio',
      citation: '395 U.S. 444 (1969)',
      category: 'speech',
      summary: 'Established that speech advocating illegal conduct is protected by the First Amendment unless it is directed to inciting or producing imminent lawless action and is likely to produce such action.',
      significance: 'Highest protection for political speech unless directed to imminent lawless action',
      hostileCircuits: ['5th Circuit'],
      keyPoints: [
        'Speech advocating violence or illegal conduct is protected',
        'Exception only for speech intended and likely to cause imminent lawless action',
        'Abstract advocacy of violence is protected',
        'Replaced the "clear and present danger" test'
      ]
    },
    {
      id: 'texas-johnson',
      title: 'Texas v. Johnson',
      citation: '491 U.S. 397 (1989)',
      category: 'speech',
      summary: 'Invalidated prohibitions on desecrating the American flag, holding that such acts are protected forms of symbolic speech under the First Amendment.',
      significance: 'Flag burning constitutes protected symbolic speech',
      hostileCircuits: ['5th Circuit'],
      keyPoints: [
        'Symbolic acts can qualify as protected "speech"',
        'Government cannot prohibit expression of an idea simply because society finds it offensive',
        'Political expression receives the highest level of First Amendment protection',
        'Applies to other forms of symbolic protest'
      ]
    },
    {
      id: 'naacp-alabama',
      title: 'NAACP v. Alabama',
      citation: '357 U.S. 449 (1958)',
      category: 'association',
      summary: 'Protected the NAACP from having to disclose its membership lists to the state of Alabama, establishing freedom of association as a fundamental right.',
      significance: 'Foundation for associational privacy in organizing',
      hostileCircuits: [],
      keyPoints: [
        'Freedom of association is protected by the First Amendment',
        'Government cannot force disclosure of group membership when it would chill associational rights',
        'Particularly important for controversial or minority viewpoints',
        'Protects digital organizing and activist networks'
      ]
    },
    {
      id: 'cox-louisiana',
      title: 'Cox v. Louisiana',
      citation: '379 U.S. 536 (1965)',
      category: 'assembly',
      summary: 'Overturned the conviction of a civil rights leader who led a peaceful demonstration near a courthouse, establishing that states cannot broadly prohibit peaceful demonstrations but may impose reasonable time, place, and manner restrictions.',
      significance: 'Established framework for protest regulation but with significant limitations',
      hostileCircuits: ['5th Circuit'],
      keyPoints: [
        'Peaceful protests are protected by the First Amendment',
        'Government can impose reasonable time, place, and manner restrictions',
        'Restrictions must be content-neutral and narrowly tailored',
        'WARNING: 5th Circuit McKesson decision has effectively gutted these protections'
      ]
    },
    {
      id: 'mckesson',
      title: 'Doe v. McKesson',
      citation: '945 F.3d 818 (5th Cir. 2019)',
      category: 'assembly',
      summary: 'The 5th Circuit held that a protest organizer could be held liable for injuries caused by an unidentified protester, creating a dangerous precedent for protest organizers in Louisiana, Mississippi, and Texas.',
      significance: 'WARNING: Creates dangerous liability for protest organizers in the 5th Circuit',
      hostileCircuits: ['5th Circuit'],
      keyPoints: [
        'Creates liability for protest organizers even without direct involvement in violence',
        'Directly contradicts Supreme Court precedent in NAACP v. Claiborne Hardware',
        'Only applies in 5th Circuit (Louisiana, Mississippi, Texas)',
        'Severely chills First Amendment protected activity'
      ]
    },
    {
      id: 'near-minnesota',
      title: 'Near v. Minnesota',
      citation: '283 U.S. 697 (1931)',
      category: 'press',
      summary: 'Established that prior restraint on publication violates freedom of the press, holding that the government cannot censor or prohibit a publication in advance.',
      significance: 'Landmark case against prior restraint of publication',
      hostileCircuits: [],
      keyPoints: [
        'Government cannot censor publications before they are published',
        'Prior restraint is presumptively unconstitutional',
        'Limited exceptions for wartime information, obscenity, and incitement',
        'Applies to both traditional and digital media'
      ]
    },
    {
      id: 'new-york-times',
      title: 'New York Times v. Sullivan',
      citation: '376 U.S. 254 (1964)',
      category: 'press',
      summary: 'Established the "actual malice" standard for defamation claims brought by public officials, requiring proof that the publisher knew the statement was false or acted with reckless disregard for the truth.',
      significance: 'Created "actual malice" standard for public figure defamation',
      hostileCircuits: [],
      keyPoints: [
        'Public officials must prove "actual malice" to win defamation suits',
        'Protects robust debate on public issues',
        'Creates breathing space for criticism of government',
        'Extended to public figures in later cases'
      ]
    }
  ];

  // Filter cases based on search query
  const filteredCases = landmarkCases.filter(caseData => {
    if (!searchQuery) return caseData.category === activeSection;
    
    const query = searchQuery.toLowerCase();
    return (
      (caseData.title.toLowerCase().includes(query) ||
       caseData.summary.toLowerCase().includes(query) ||
       caseData.citation.toLowerCase().includes(query)) &&
      (activeSection === 'all' || caseData.category === activeSection)
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
          <BookMarked className="mr-2 h-6 w-6 text-primary-400" />
          First Amendment Rights
        </h2>
        <p className="text-gray-400">
          Analysis of key First Amendment protections and landmark cases
        </p>
      </div>

      {/* Section Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max border-b border-dark-600">
          <button
            onClick={() => handleSectionChange('speech')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'speech'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Freedom of Speech
          </button>
          <button
            onClick={() => handleSectionChange('press')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'press'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Freedom of Press
          </button>
          <button
            onClick={() => handleSectionChange('assembly')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'assembly'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Right to Assembly
          </button>
          <button
            onClick={() => handleSectionChange('association')}
            className={`px-4 py-2 flex items-center whitespace-nowrap ${
              activeSection === 'association'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Freedom of Association
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

      {/* Section Introduction */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 p-5 bg-dark-700 rounded-lg border border-dark-600"
        >
          {activeSection === 'speech' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Freedom of Speech</h3>
              <p className="text-gray-400 mb-4">
                The First Amendment protects the right to express opinions without government restraint. This protection extends to symbolic speech, such as flag burning, and with few exceptions, prevents the government from restricting expression based on its content.
              </p>
              <div className="flex items-center text-sm text-primary-400 hover:text-primary-300">
                <a href="https://www.law.cornell.edu/constitution/first_amendment" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Read the First Amendment text
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
          
          {activeSection === 'press' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Freedom of the Press</h3>
              <p className="text-gray-400 mb-4">
                The First Amendment protects the right to publish and distribute information without government interference. This includes protection against prior restraint (censorship before publication) and establishes high standards for defamation claims against public figures.
              </p>
              <div className="flex items-center text-sm text-primary-400 hover:text-primary-300">
                <a href="https://www.law.cornell.edu/constitution/first_amendment" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Read the First Amendment text
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
          
          {activeSection === 'assembly' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Right to Peaceful Assembly</h3>
              <p className="text-gray-400 mb-4">
                The First Amendment protects the right to gather peacefully to express, promote, pursue, and defend shared interests. While the government may impose reasonable time, place, and manner restrictions, these must be content-neutral and narrowly tailored to serve a significant governmental interest.
              </p>
              <div className="flex items-center text-sm text-primary-400 hover:text-primary-300">
                <a href="https://www.law.cornell.edu/constitution/first_amendment" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Read the First Amendment text
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
          
          {activeSection === 'association' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Freedom of Association</h3>
              <p className="text-gray-400 mb-4">
                While not explicitly mentioned in the First Amendment, the Supreme Court has recognized freedom of association as a fundamental right derived from the freedoms of speech, assembly, and petition. This protects the right to join or form groups and the privacy of group membership, particularly for advocacy organizations.
              </p>
              <div className="flex items-center text-sm text-primary-400 hover:text-primary-300">
                <a href="https://www.law.cornell.edu/constitution/first_amendment" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Read the First Amendment text
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
          
          {activeSection === 'all' && (
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">First Amendment Overview</h3>
              <p className="text-gray-400 mb-4">
                The First Amendment protects several fundamental freedoms: speech, press, religion, assembly, and the right to petition the government. These interconnected rights form the foundation of democratic participation and protect the free exchange of ideas, even controversial or unpopular ones.
              </p>
              <div className="flex items-center text-sm text-primary-400 hover:text-primary-300">
                <a href="https://www.law.cornell.edu/constitution/first_amendment" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  Read the First Amendment text
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Case Cards */}
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
            <BookMarked className="h-12 w-12 text-gray-600 mx-auto mb-4" />
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

      {/* 5th Circuit Warning */}
      <div className="mb-8 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-400 mb-2">5th Circuit Warning</h3>
            <p className="text-sm text-gray-300 mb-3">
              The 5th Circuit Court of Appeals (covering Louisiana, Mississippi, and Texas) has significantly weakened First Amendment protections, particularly for protest organizers. The <span className="text-red-400">Doe v. McKesson</span> decision creates potential liability for protest organizers even when they did not engage in or encourage violence.
            </p>
            <p className="text-sm text-gray-300">
              Exercise heightened caution when engaging in First Amendment activities in these jurisdictions. Consider consulting with an attorney familiar with 5th Circuit precedent before organizing protests or demonstrations in Louisiana, Mississippi, or Texas.
            </p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Additional Resources</h3>
          <button className="text-primary-400 hover:text-primary-300 flex items-center text-sm">
            <Download className="h-4 w-4 mr-1" />
            Download Guide
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a 
            href="https://www.aclu.org/know-your-rights/protesters-rights"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              ACLU Know Your Rights: Protesters' Rights
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Comprehensive guide to your rights when demonstrating and protesting.
            </p>
          </a>
          
          <a 
            href="https://www.eff.org/issues/free-speech"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              EFF: Free Speech
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Resources on free speech in the digital age and online platforms.
            </p>
          </a>
          
          <a 
            href="https://www.rcfp.org/resources/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              Reporters Committee for Freedom of the Press
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Legal resources for journalists and media organizations.
            </p>
          </a>
          
          <a 
            href="https://www.justice.gov/crt/addressing-police-misconduct-laws-enforced-department-justice"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-dark-700 rounded-lg border border-dark-600 hover:border-primary-600/50 transition-colors group"
          >
            <h4 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors flex items-center">
              DOJ: Addressing Police Misconduct
              <ExternalLink className="ml-2 h-3 w-3" />
            </h4>
            <p className="text-sm text-gray-400">
              Information on federal laws that address police misconduct and enforcement.
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
              First Amendment law varies by jurisdiction and changes over time. Always consult with a qualified attorney for
              specific legal guidance tailored to your situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstAmendmentTool;