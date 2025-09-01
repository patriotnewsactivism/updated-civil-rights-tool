import React, { useState } from 'react';

const LegalToolkit = () => {
  const [activeTab, setActiveTab] = useState('stop-and-id');

  // State public records data
  const statePublicRecordsData = {
    AL: { name: 'Alabama', statute: 'Alabama Open Records Act (Code of Alabama § 36-12-40)', timeLimit: '7-10 business days' },
    AK: { name: 'Alaska', statute: 'Alaska Public Records Act (AS § 40.25.110-40.25.220)', timeLimit: '10 business days' },
    AZ: { name: 'Arizona', statute: 'Arizona Public Records Law (A.R.S. § 39-121)', timeLimit: 'Promptly (no specific timeframe)' },
    AR: { name: 'Arkansas', statute: 'Arkansas Freedom of Information Act (A.C.A. § 25-19-101)', timeLimit: '3 business days' },
    CA: { name: 'California', statute: 'California Public Records Act (Government Code § 6250)', timeLimit: '10 calendar days' },
    CO: { name: 'Colorado', statute: 'Colorado Open Records Act (C.R.S. § 24-72-201)', timeLimit: '3 business days' },
    CT: { name: 'Connecticut', statute: 'Connecticut Freedom of Information Act (C.G.S. § 1-200)', timeLimit: '4 business days' },
    DE: { name: 'Delaware', statute: 'Delaware Freedom of Information Act (29 Del. C. § 10001)', timeLimit: '15 business days' },
    FL: { name: 'Florida', statute: 'Florida Sunshine Law (F.S. § 119.01)', timeLimit: 'Reasonable time (typically within days)' },
    GA: { name: 'Georgia', statute: 'Georgia Open Records Act (O.C.G.A. § 50-18-70)', timeLimit: '3 business days' },
    HI: { name: 'Hawaii', statute: 'Hawaii Uniform Information Practices Act (HRS § 92F)', timeLimit: '10 business days' },
    ID: { name: 'Idaho', statute: 'Idaho Public Records Act (Idaho Code § 74-101)', timeLimit: '3 business days' },
    IL: { name: 'Illinois', statute: 'Illinois Freedom of Information Act (5 ILCS 140/)', timeLimit: '5 business days' },
    IN: { name: 'Indiana', statute: 'Indiana Access to Public Records Act (IC § 5-14-3)', timeLimit: '24 hours (for documents readily available)' },
    IA: { name: 'Iowa', statute: 'Iowa Open Records Law (Iowa Code § 22)', timeLimit: 'As soon as reasonably possible' },
    KS: { name: 'Kansas', statute: 'Kansas Open Records Act (K.S.A. § 45-215)', timeLimit: '3 business days' },
    KY: { name: 'Kentucky', statute: 'Kentucky Open Records Act (KRS § 61.870)', timeLimit: '3 business days' },
    LA: { name: 'Louisiana', statute: 'Louisiana Public Records Act (R.S. 44:1)', timeLimit: '3 business days' },
    ME: { name: 'Maine', statute: 'Maine Freedom of Access Act (1 M.R.S. § 401)', timeLimit: 'Reasonable time' },
    MD: { name: 'Maryland', statute: 'Maryland Public Information Act (GP § 4-101)', timeLimit: '30 days' },
    MA: { name: 'Massachusetts', statute: 'Massachusetts Public Records Law (M.G.L. c. 66)', timeLimit: '10 business days' },
    MI: { name: 'Michigan', statute: 'Michigan Freedom of Information Act (MCL § 15.231)', timeLimit: '5 business days' },
    MN: { name: 'Minnesota', statute: 'Minnesota Data Practices Act (M.S. § 13.01)', timeLimit: 'Immediately (if readily available)' },
    MS: { name: 'Mississippi', statute: 'Mississippi Public Records Act (Miss. Code § 25-61-1)', timeLimit: '7 business days' },
    MO: { name: 'Missouri', statute: 'Missouri Sunshine Law (R.S.Mo. § 610.010)', timeLimit: '3 business days' },
    MT: { name: 'Montana', statute: 'Montana Right to Know Act (MCA § 2-6-101)', timeLimit: 'Reasonable time' },
    NE: { name: 'Nebraska', statute: 'Nebraska Public Records Statutes (Neb. Rev. Stat. § 84-712)', timeLimit: '4 business days' },
    NV: { name: 'Nevada', statute: 'Nevada Public Records Law (NRS § 239.010)', timeLimit: 'Within 5 business days' },
    NH: { name: 'New Hampshire', statute: 'New Hampshire Right to Know Law (RSA § 91-A)', timeLimit: '5 business days' },
    NJ: { name: 'New Jersey', statute: 'New Jersey Open Public Records Act (N.J.S.A. § 47:1A-1)', timeLimit: '7 business days' },
    NM: { name: 'New Mexico', statute: 'New Mexico Inspection of Public Records Act (NMSA § 14-2-1)', timeLimit: 'Within 15 calendar days' },
    NY: { name: 'New York', statute: 'New York Freedom of Information Law (FOIL)', timeLimit: '5 business days' },
    NC: { name: 'North Carolina', statute: 'North Carolina Public Records Law (G.S. § 132-1)', timeLimit: 'Within 10 business days' },
    ND: { name: 'North Dakota', statute: 'North Dakota Open Records Law (NDCC § 44-04-18)', timeLimit: 'Within 5 business days' },
    OH: { name: 'Ohio', statute: 'Ohio Public Records Act (ORC § 149.43)', timeLimit: 'Within a reasonable period of time' },
    OK: { name: 'Oklahoma', statute: 'Oklahoma Open Records Act (51 O.S. § 24A.1)', timeLimit: 'Within 3 business days' },
    OR: { name: 'Oregon', statute: 'Oregon Public Records Law (ORS § 192.311)', timeLimit: 'Within 5 business days' },
    PA: { name: 'Pennsylvania', statute: 'Pennsylvania Right-to-Know Law (65 P.S. § 67.101)', timeLimit: 'Within 5 business days' },
    RI: { name: 'Rhode Island', statute: 'Rhode Island Access to Public Records Act (RIGL § 38-2-1)', timeLimit: '10 business days' },
    SC: { name: 'South Carolina', statute: 'South Carolina Freedom of Information Act (SC Code § 30-4-10)', timeLimit: 'Within 10 calendar days' },
    SD: { name: 'South Dakota', statute: 'South Dakota Open Records Law (SDCL § 1-27A-1)', timeLimit: 'Within 5 business days' },
    TN: { name: 'Tennessee', statute: 'Tennessee Public Records Act (TCA § 10-7-101)', timeLimit: 'Within 7 business days' },
    TX: { name: 'Texas', statute: 'Texas Public Information Act (Govt. Code § 552.001)', timeLimit: 'Within 10 business days' },
    UT: { name: 'Utah', statute: 'Utah Governmental Records Access and Management Act (GRAMA)', timeLimit: 'Within 10 business days' },
    VT: { name: 'Vermont', statute: 'Vermont Public Records Law (1 V.S.A. § 317)', timeLimit: 'Within 5 business days' },
    VA: { name: 'Virginia', statute: 'Virginia Freedom of Information Act (Va. Code § 2.2-3700)', timeLimit: 'Within 5 business days' },
    WA: { name: 'Washington', statute: 'Washington Public Records Act (RCW § 42.56)', timeLimit: 'Within 5 business days' },
    WV: { name: 'West Virginia', statute: 'West Virginia Freedom of Information Act (WV Code § 29B-1-1)', timeLimit: 'Within 5 business days' },
    WI: { name: 'Wisconsin', statute: 'Wisconsin Public Records Law (Wis. Stat. § 19.31)', timeLimit: 'Within a reasonable time' },
    WY: { name: 'Wyoming', statute: 'Wyoming Public Records Act (W.S. § 16-4-201)', timeLimit: 'Within 3 business days' },
    DC: { name: 'District of Columbia', statute: 'District of Columbia Freedom of Information Act (DC Code § 2-531)', timeLimit: 'Within 15 business days' }
  };

  // Constitutional provisions data
  const constitutionalProvisions = [
    {
      provision: 'First Amendment',
      description: 'Freedom of speech, press, assembly, and petition',
      significance: 'Protects political expression, peaceful assembly, and organizational activities',
      application: 'Critical for protecting protest activities, organizational communications, and advocacy'
    },
    {
      provision: 'Fourth Amendment',
      description: 'Protection against unreasonable searches and seizures',
      significance: 'Requires probable cause or reasonable suspicion for government interference',
      application: 'Essential for protecting personal privacy and property from unwarranted government intrusion'
    },
    {
      provision: 'Fourteenth Amendment',
      description: 'Equal protection and due process under law',
      significance: 'Prevents discriminatory enforcement and ensures fair legal proceedings',
      application: 'Foundation for challenging discriminatory policing and enforcement practices'
    }
  ];

  // Legal strategies data
  const legalStrategies = [
    {
      strategy: 'Documentation Protocol',
      description: 'Systematic recording of incidents and interactions',
      implementation: 'Capture badge numbers, patrol car numbers, time, location, and specific officer statements',
      importance: 'Essential evidence for legal challenges and pattern identification'
    },
    {
      strategy: 'Assert Constitutional Rights',
      description: 'Clearly state constitutional protections during interactions',
      implementation: 'Use precise language: "I assert my Fourth Amendment rights" or "I am exercising my right to remain silent"',
      importance: 'Establishes clear constitutional boundaries and prevents ambiguous consent'
    },
    {
      strategy: 'Challenge Reasonable Suspicion',
      description: 'Demand specific articulation of suspicion grounds',
      implementation: 'Ask directly: "What specific facts give you reasonable suspicion to detain me?"',
      importance: 'Forces officers to articulate legal justification and creates record of constitutional analysis'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <header className="mb-12">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Scale className="h-10 w-10 text-primary-400 mr-3" />
                <h1 className="text-3xl font-bold constitutional-title">
                  Constitutional Rights Research Platform
                </h1>
              </div>
              <nav className="flex space-x-6">
                <a href="/" className="nav-link flex items-center text-lg">
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </a>
                <a href="/upload" className="nav-link flex items-center text-lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Add Case
                </a>
                <a href="/toolkit" className="nav-link flex items-center text-lg">
                  <Tool className="h-5 w-5 mr-2" />
                  Toolkit
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold constitutional-title mb-6">
              Legal Defense Toolkit
            </h1>
            <p className="forensic-analysis-text max-w-3xl mx-auto">
              Comprehensive legal resources for protecting civil rights during government interactions
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-dark-800 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('stop-and-id')}
                className={`px-6 py-3 rounded-md transition-colors ${
                  activeTab === 'stop-and-id' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                Stop and ID Laws
              </button>
              <button 
                onClick={() => setActiveTab('constitutional')}
                className={`px-6 py-3 rounded-md transition-colors ${
                  activeTab === 'constitutional' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                Constitutional Provisions
              </button>
              <button 
                onClick={() => setActiveTab('strategies')}
                className={`px-6 py-3 rounded-md transition-colors ${
                  activeTab === 'strategies' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                Legal Strategies
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="card p-8">
            {activeTab === 'stop-and-id' && (
              <div>
                <h2 className="text-2xl section-title mb-6 text-primary-400">State Stop and ID Laws</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(statePublicRecordsData).map(([code, data]) => (
                    <div key={code} className="bg-dark-800/50 p-6 rounded-lg border border-dark-600">
                      <h3 className="text-xl font-semibold mb-3 text-secondary-400">{data.name}</h3>
                      <div className="space-y-2">
                        <p className="text-dark-300 text-sm">
                          <span className="font-medium text-white">Statute:</span> {data.statute}
                        </p>
                        <p className="text-dark-300 text-sm">
                          <span className="font-medium text-white">Time Limit:</span> {data.timeLimit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'constitutional' && (
              <div>
                <h2 className="text-2xl section-title mb-6 text-primary-400">Constitutional Provisions</h2>
                <div className="space-y-6">
                  {constitutionalProvisions.map((provision, index) => (
                    <div key={index} className="bg-dark-800/50 p-6 rounded-lg border border-dark-600">
                      <h3 className="text-xl font-semibold mb-3 text-secondary-400">{provision.provision}</h3>
                      <div className="space-y-3">
                        <p className="text-dark-300">
                          <span className="font-medium text-white">Description:</span> {provision.description}
                        </p>
                        <p className="text-dark-300">
                          <span className="font-medium text-white">Significance:</span> {provision.significance}
                        </p>
                        <p className="text-dark-300">
                          <span className="font-medium text-white">Application:</span> {provision.application}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'strategies' && (
              <div>
                <h2 className="text-2xl section-title mb-6 text-primary-400">Legal Defense Strategies</h2>
                <div className="space-y-6">
                  {legalStrategies.map((strategy, index) => (
                    <div key={index} className="bg-dark-800/50 p-6 rounded-lg border border-dark-600">
                      <h3 className="text-xl font-semibold mb-3 text-secondary-400">{strategy.strategy}</h3>
                      <div className="space-y-3">
                        <p className="text-dark-300">
                          <span className="font-medium text-white">Description:</span> {strategy.description}
                        </p>
                        <p className="text-dark-300">
                          <span className="font-medium text-white">Implementation:</span> {strategy.implementation}
                        </p>
                        <p className="text-dark-300">
                          <span className="font-medium text-white">Importance:</span> {strategy.importance}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LegalToolkit;