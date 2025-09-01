import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Download,
  Search,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const StopAndIdTool = () => {
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stop and ID data by state
  const stopAndIdData = {
    'AL': {
      name: 'Alabama',
      status: 'stop-and-id',
      statute: 'Ala. Code § 15-5-30',
      summary: 'Alabama is a stop-and-identify state. Officers may stop a person in a public place when they have reasonable suspicion the person has committed, is committing, or is about to commit a crime, and may ask for their name, address, and an explanation of their actions.',
      requirements: [
        'Reasonable suspicion of criminal activity',
        'Must provide name, address, and explanation of actions',
        'No explicit requirement to provide physical ID'
      ],
      controllingPrecedents: [
        'Hiibel v. Sixth Judicial District Court, 542 U.S. 177 (2004)',
        'Terry v. Ohio, 392 U.S. 1 (1968)'
      ],
      tacticalNotes: 'While Alabama law requires providing your name and address, there is no statutory requirement to produce physical identification. However, refusing to identify yourself when lawfully detained can result in arrest.'
    },
    'AZ': {
      name: 'Arizona',
      status: 'stop-and-id',
      statute: 'Ariz. Rev. Stat. § 13-2412',
      summary: 'Arizona is a stop-and-identify state. When lawfully detained, you must provide your true full name if requested by an officer who has reasonable suspicion of criminal activity.',
      requirements: [
        'Reasonable suspicion of criminal activity',
        'Must provide true full name',
        'No explicit requirement to provide physical ID'
      ],
      controllingPrecedents: [
        'Hiibel v. Sixth Judicial District Court, 542 U.S. 177 (2004)',
        'State v. Akins, 153 P.3d 1132 (Ariz. Ct. App. 2007)'
      ],
      tacticalNotes: 'Arizona law only requires providing your true full name, not address or other information. However, refusing to provide your name when lawfully detained can result in a class 2 misdemeanor.'
    },
    'CA': {
      name: 'California',
      status: 'no-stop-and-id',
      statute: 'No specific statute',
      summary: 'California is not a stop-and-identify state. While officers may request identification during a lawful detention, there is no state statute requiring a person to identify themselves.',
      requirements: [
        'No statutory requirement to identify yourself',
        'Vehicle operators must present license when driving'
      ],
      controllingPrecedents: [
        'People v. Loudermilk, 195 Cal. App. 3d 996 (Cal. Ct. App. 1987)',
        'People v. Long, 189 Cal. App. 3d 77 (Cal. Ct. App. 1987)'
      ],
      tacticalNotes: 'While California has no stop-and-identify statute, refusing to identify yourself might extend the length of a detention if police are trying to verify your identity. Vehicle operators are still required to present a license when driving.'
    },
    'FL': {
      name: 'Florida',
      status: 'stop-and-id',
      statute: 'Fla. Stat. § 856.021(2)',
      summary: 'Florida is a stop-and-identify state. A person lawfully detained under the loitering and prowling statute must identify themselves and explain their presence and conduct.',
      requirements: [
        'Reasonable suspicion of loitering or prowling',
        'Must identify yourself and explain your presence',
        'No explicit requirement to provide physical ID'
      ],
      controllingPrecedents: [
        'Hiibel v. Sixth Judicial District Court, 542 U.S. 177 (2004)',
        'State v. Ecker, 311 So. 2d 104 (Fla. 1975)'
      ],
      tacticalNotes: 'Florida\'s stop-and-identify requirement is tied specifically to the loitering and prowling statute, not all detentions. The statute requires identification but does not explicitly require providing a physical ID document.'
    },
    'NY': {
      name: 'New York',
      status: 'no-stop-and-id',
      statute: 'No specific statute',
      summary: 'New York is not a stop-and-identify state. There is no state statute requiring a person to identify themselves to law enforcement officers.',
      requirements: [
        'No statutory requirement to identify yourself',
        'Vehicle operators must present license when driving'
      ],
      controllingPrecedents: [
        'People v. Howard, 50 N.Y.2d 583 (N.Y. 1980)',
        'People v. DeBour, 40 N.Y.2d 210 (N.Y. 1976)'
      ],
      tacticalNotes: 'While New York has no stop-and-identify statute, the "DeBour" four-level test governs police encounters. At level 2 ("common law right of inquiry"), officers cannot demand identification, but at level 3 (Terry stop), they may request it, though you are not legally required to provide it.'
    },
    'TX': {
      name: 'Texas',
      status: 'no-stop-and-id',
      statute: 'Tex. Penal Code § 38.02',
      summary: 'Texas is not a traditional stop-and-identify state. You only have to identify yourself if you have already been lawfully arrested, not merely detained.',
      requirements: [
        'Only required to identify after lawful arrest, not during detention',
        'Providing false information is prohibited'
      ],
      controllingPrecedents: [
        'Brown v. Texas, 443 U.S. 47 (1979)',
        'Dutton v. Hayes-Pupko, No. 03-06-00438 (Tex. App. 2008)'
      ],
      tacticalNotes: 'Texas law only requires identification after a lawful arrest, not during a detention or Terry stop. However, it is a crime to provide false identification information to an officer.'
    }
  };

  // Filter states based on search query
  const filteredStates = Object.keys(stopAndIdData).filter(stateCode => {
    const state = stopAndIdData[stateCode];
    return (
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stateCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'stop-and-id':
        return {
          color: 'text-warning-400',
          bgColor: 'bg-warning-900/30',
          borderColor: 'border-warning-700/50',
          icon: <AlertTriangle className="h-5 w-5 text-warning-400 mr-2" />
        };
      case 'no-stop-and-id':
        return {
          color: 'text-success-400',
          bgColor: 'bg-success-900/30',
          borderColor: 'border-success-700/50',
          icon: <CheckCircle className="h-5 w-5 text-success-400 mr-2" />
        };
      default:
        return {
          color: 'text-gray-400',
          bgColor: 'bg-dark-700',
          borderColor: 'border-dark-600',
          icon: <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
        };
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Shield className="mr-2 h-6 w-6 text-primary-400" />
          Stop and Identification Laws
        </h2>
        <p className="text-gray-400">
          State-by-state analysis of identification requirements during police encounters
        </p>
      </div>

      {/* Search and State Selection */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search states..."
            className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
      </div>

      {/* State Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredStates.map((stateCode) => {
          const state = stopAndIdData[stateCode];
          const statusInfo = getStatusInfo(state.status);
          
          return (
            <button
              key={stateCode}
              onClick={() => setSelectedState(stateCode)}
              className={`p-4 rounded-lg border ${
                selectedState === stateCode 
                  ? 'border-primary-600 bg-primary-900/20' 
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600'
              } text-left transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <h3 className="font-medium text-white">{state.name} ({stateCode})</h3>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${statusInfo.color} ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
                  {state.status === 'stop-and-id' ? 'Stop & ID' : 'No Stop & ID'}
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">
                {state.summary.split('.')[0]}.
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected State Details */}
      {selectedState && stopAndIdData[selectedState] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="bg-dark-700 rounded-lg p-6 border border-dark-600">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div className="flex items-center mb-3 md:mb-0">
                <MapPin className="h-5 w-5 text-primary-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">{stopAndIdData[selectedState].name} ({selectedState})</h3>
              </div>
              
              <div className="flex items-center">
                {getStatusInfo(stopAndIdData[selectedState].status).icon}
                <span className={`font-medium ${getStatusInfo(stopAndIdData[selectedState].status).color}`}>
                  {stopAndIdData[selectedState].status === 'stop-and-id' ? 'Stop & ID State' : 'No Stop & ID Requirement'}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Statute:</h4>
              <p className="text-gray-400">{stopAndIdData[selectedState].statute}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Summary:</h4>
              <p className="text-gray-400">{stopAndIdData[selectedState].summary}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Requirements:</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {stopAndIdData[selectedState].requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Controlling Precedents:</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {stopAndIdData[selectedState].controllingPrecedents.map((precedent, index) => (
                  <li key={index}>{precedent}</li>
                ))}
              </ul>
            </div>
            
            {stopAndIdData[selectedState].tacticalNotes && (
              <div className="p-3 bg-dark-800 rounded-lg border border-dark-600">
                <h4 className="text-sm font-medium text-primary-300 mb-1">Tactical Notes:</h4>
                <p className="text-sm text-gray-400">{stopAndIdData[selectedState].tacticalNotes}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* General Information */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Understanding Stop and ID Laws</h3>
          <button className="text-primary-400 hover:text-primary-300 flex items-center text-sm">
            <Download className="h-4 w-4 mr-1" />
            Download Guide
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              What are "Stop and ID" laws?
            </h4>
            <p className="text-gray-400 ml-6">
              "Stop and ID" laws are statutes that allow law enforcement officers to detain individuals they reasonably suspect of criminal activity and require them to identify themselves. The Supreme Court case Hiibel v. Sixth Judicial District Court (2004) upheld the constitutionality of these laws when based on reasonable suspicion.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              What is "reasonable suspicion"?
            </h4>
            <p className="text-gray-400 ml-6">
              Reasonable suspicion is a legal standard that requires more than a hunch but less than probable cause. It must be based on specific and articulable facts that, taken together with rational inferences, suggest criminal activity. Officers cannot stop and demand identification without meeting this threshold.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              What happens in non-stop-and-ID states?
            </h4>
            <p className="text-gray-400 ml-6">
              In states without stop-and-identify statutes, you generally cannot be arrested merely for refusing to identify yourself during a detention based on reasonable suspicion. However, officers may still ask for identification, and refusing to provide it might extend the length of the detention while they attempt to identify you through other means.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              Special circumstances
            </h4>
            <p className="text-gray-400 ml-6">
              Regardless of state laws, certain situations always require identification:
              <br />• When operating a motor vehicle (driver's license)
              <br />• When entering secure facilities
              <br />• When purchasing age-restricted items
              <br />• When you have already been arrested
            </p>
          </div>
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
              Laws vary by jurisdiction and change over time. Always consult with a qualified attorney for
              specific legal guidance tailored to your situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StopAndIdTool;