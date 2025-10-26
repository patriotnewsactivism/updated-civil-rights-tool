import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  MapPin, 
  Clock, 
  Download, 
  Search,
  AlertTriangle,
  ChevronRight,
  Copy,
  CheckCircle
} from 'lucide-react';

const PublicRecordsTool = () => {
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  
  // Public Records data by state
  const publicRecordsData = {
    'AL': {
      name: 'Alabama',
      statute: 'Alabama Open Records Act (Code of Alabama § 36-12-40)',
      timeLimit: '7-10 business days',
      fees: 'Reasonable, not to exceed actual cost',
      electronicRecords: 'Not specifically addressed in statute',
      exemptions: [
        'Records received by public officer in confidence',
        'Sensitive personnel records',
        'Ongoing criminal investigations',
        'Records that would be detrimental to public safety'
      ],
      appealProcess: 'File lawsuit in circuit court',
      requestTemplate: `[Your Name]\n[Your Address]\n[City, State ZIP]\n[Your Email]\n[Your Phone]\n\n[Date]\n\n[Agency Name]\n[Agency Address]\n[City, State ZIP]\n\nRE: Public Records Request\n\nDear Records Custodian:\n\nPursuant to the Alabama Open Records Act (Code of Alabama § 36-12-40), I hereby request copies of the following records:\n\n[Describe the records with reasonable particularity]\n\nIf there are any fees for searching or copying these records, please inform me if the cost will exceed $____. However, I would also like to request a waiver of all fees in that the disclosure of the requested information is in the public interest.\n\nThe Alabama Open Records Act requires a response within a reasonable time. If access to the records I am requesting will take longer, please contact me with information about when I might expect copies or the ability to inspect the requested records.\n\nIf you deny any or all of this request, please cite each specific exemption you feel justifies the refusal to release the information and notify me of the appeal procedures available to me under the law.\n\nThank you for considering my request.\n\nSincerely,\n\n[Your Name]`
    },
    'CA': {
      name: 'California',
      statute: 'California Public Records Act (Government Code § 6250)',
      timeLimit: '10 calendar days',
      fees: 'Direct costs of duplication only',
      electronicRecords: 'Must be provided in electronic format when available',
      exemptions: [
        'Personnel, medical, or similar files',
        'Pending litigation records',
        'Preliminary drafts, notes, or memos',
        'Records protected by attorney-client privilege',
        'Records that would invade personal privacy'
      ],
      appealProcess: 'No administrative appeal; must file lawsuit',
      requestTemplate: `[Your Name]\n[Your Address]\n[City, State ZIP]\n[Your Email]\n[Your Phone]\n\n[Date]\n\n[Agency Name]\n[Agency Address]\n[City, State ZIP]\n\nRE: Public Records Act Request\n\nDear Records Custodian:\n\nPursuant to the California Public Records Act (Government Code § 6250 et seq.), I hereby request copies of the following records:\n\n[Describe the records with reasonable particularity]\n\nI request that these records be provided in electronic format if available. If the requested records are available online, please provide the URL where they can be accessed.\n\nIf you determine that any or all of the information requested is exempt from disclosure, please note whether, when, and from whom the records were received, and explain how the exemption applies to the information requested. If portions of any documents are exempt, please redact the exempt portions and provide the remainder of the record.\n\nThe California Public Records Act requires a response within 10 calendar days. If access to the records I am requesting will take longer, please contact me with information about when I might expect copies or the ability to inspect the requested records.\n\nIf you determine that any or all of the information requested is exempt from disclosure, please provide a written response citing the specific exemption(s) upon which you rely.\n\nThank you for your assistance.\n\nSincerely,\n\n[Your Name]`
    },
    'FL': {
      name: 'Florida',
      statute: 'Florida Sunshine Law (F.S. § 119.01)',
      timeLimit: 'Reasonable time (typically within days)',
      fees: 'Up to $0.15 per one-sided page; $0.20 per two-sided page',
      electronicRecords: 'Must be provided if available',
      exemptions: [
        'Active criminal investigative information',
        'Confidential informant identities',
        'Security system plans',
        'Social security numbers',
        'Medical records'
      ],
      appealProcess: 'File civil action in circuit court',
      requestTemplate: `[Your Name]\n[Your Address]\n[City, State ZIP]\n[Your Email]\n[Your Phone]\n\n[Date]\n\n[Agency Name]\n[Agency Address]\n[City, State ZIP]\n\nRE: Public Records Request\n\nDear Records Custodian:\n\nPursuant to Article I, Section 24 of the Florida Constitution, and Chapter 119, Florida Statutes, I hereby request copies of the following records:\n\n[Describe the records with reasonable particularity]\n\nIf these records are available in electronic format, I would prefer to receive them in that format. If you anticipate that the response to this request will take longer than the statutory timeframe, please contact me with information about when I might expect copies or the ability to inspect the requested records.\n\nIf you deny any or all of this request, please cite each specific exemption you feel justifies the refusal to release the information and notify me of the appeal procedures available to me under the law.\n\nAs provided by Florida Statute, I agree to pay the actual cost of duplication as defined in F.S. 119.07(4)(a). However, please notify me if the fees will exceed $____.\n\nThank you for your assistance.\n\nSincerely,\n\n[Your Name]`
    },
    'NY': {
      name: 'New York',
      statute: 'New York Freedom of Information Law (Public Officers Law Article 6)',
      timeLimit: '5 business days to acknowledge; 20 business days to provide records',
      fees: 'Up to $0.25 per page for photocopies; actual cost for other formats',
      electronicRecords: 'Must be provided in requested format if reasonably able',
      exemptions: [
        'Records that would impair contract awards or collective bargaining',
        'Trade secrets',
        'Inter-agency or intra-agency materials',
        'Records that would endanger life or safety',
        'Law enforcement records that would interfere with investigations'
      ],
      appealProcess: 'Administrative appeal to agency head, then Article 78 proceeding',
      requestTemplate: `[Your Name]\n[Your Address]\n[City, State ZIP]\n[Your Email]\n[Your Phone]\n\n[Date]\n\n[Agency Name]\n[Agency Address]\n[City, State ZIP]\n\nRE: Freedom of Information Law Request\n\nDear Records Access Officer:\n\nUnder the provisions of the New York Freedom of Information Law (Public Officers Law Article 6), I hereby request copies of the following records:\n\n[Describe the records with reasonable particularity]\n\nIf there are any fees for copying the records requested, please inform me before filling the request if the cost will exceed $____.\n\nAs you know, the Freedom of Information Law requires that an agency respond to a request within five business days of receipt of a request. Therefore, I would appreciate a response as soon as possible and look forward to hearing from you shortly.\n\nIf for any reason any portion of my request is denied, please inform me of the reasons for the denial in writing and provide the name and address of the person or body to whom an appeal should be directed.\n\nThank you for your assistance.\n\nSincerely,\n\n[Your Name]`
    },
    'TX': {
      name: 'Texas',
      statute: 'Texas Public Information Act (Tex. Gov\'t Code § 552.001)',
      timeLimit: '10 business days',
      fees: 'Set by General Services Commission',
      electronicRecords: 'Must be provided in requested format if reasonably able',
      exemptions: [
        'Confidential information by law',
        'Personnel files that would constitute invasion of privacy',
        'Pending litigation information',
        'Trade secrets',
        'Attorney-client privileged information'
      ],
      appealProcess: 'Request Attorney General opinion, then judicial review',
      requestTemplate: `[Your Name]\n[Your Address]\n[City, State ZIP]\n[Your Email]\n[Your Phone]\n\n[Date]\n\n[Agency Name]\n[Agency Address]\n[City, State ZIP]\n\nRE: Public Information Request\n\nDear Public Information Officer:\n\nUnder the Texas Public Information Act, Chapter 552 of the Government Code, I hereby request copies of the following records:\n\n[Describe the records with reasonable particularity]\n\nIf you determine that some portions of the requested information are exempt from disclosure, please provide the portions that can be disclosed. I ask that you justify any redactions by reference to specific exemptions of the Act.\n\nI would prefer to receive this information electronically. If that is not possible, I request that you provide copies of the records rather than just the opportunity to inspect them.\n\nThe Texas Public Information Act requires that you "promptly produce" the requested records unless, within 10 business days, you have sought an Attorney General's opinion. If you expect a significant delay in responding to this request, please contact me with information about when I might expect copies or the ability to inspect the requested records.\n\nIf you have any questions regarding this request, please contact me at [your phone number or email]. Thank you for your assistance.\n\nSincerely,\n\n[Your Name]`
    }
  };

  // Filter states based on search query
  const filteredStates = Object.keys(publicRecordsData).filter(stateCode => {
    const state = publicRecordsData[stateCode];
    return (
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stateCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle copy template
  const handleCopyTemplate = () => {
    if (selectedState && publicRecordsData[selectedState]) {
      navigator.clipboard.writeText(publicRecordsData[selectedState].requestTemplate);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <FileText className="mr-2 h-6 w-6 text-primary-400" />
          Public Records Request Guide
        </h2>
        <p className="text-gray-400">
          State-by-state guide to public records laws and request templates
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
          const state = publicRecordsData[stateCode];
          
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
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {state.timeLimit}
                </div>
              </div>
              <p className="text-sm text-gray-400 line-clamp-1">
                {state.statute}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected State Details */}
      {selectedState && publicRecordsData[selectedState] && (
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
                <h3 className="text-xl font-semibold text-white">{publicRecordsData[selectedState].name} ({selectedState})</h3>
              </div>
              
              <div className="flex items-center text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>Response time: {publicRecordsData[selectedState].timeLimit}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Statute:</h4>
              <p className="text-gray-400">{publicRecordsData[selectedState].statute}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Fees:</h4>
                <p className="text-gray-400">{publicRecordsData[selectedState].fees}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Electronic Records:</h4>
                <p className="text-gray-400">{publicRecordsData[selectedState].electronicRecords}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Common Exemptions:</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                {publicRecordsData[selectedState].exemptions.map((exemption, index) => (
                  <li key={index}>{exemption}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-1">Appeal Process:</h4>
              <p className="text-gray-400">{publicRecordsData[selectedState].appealProcess}</p>
            </div>
            
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-primary-300">Request Template</h4>
                <button 
                  onClick={handleCopyTemplate}
                  className="flex items-center text-xs bg-dark-700 hover:bg-dark-600 text-gray-300 px-3 py-1 rounded-md transition-colors"
                >
                  {copiedTemplate ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1 text-success-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Template
                    </>
                  )}
                </button>
              </div>
              <div className="bg-dark-900 p-3 rounded-md overflow-auto max-h-60">
                <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono">
                  {publicRecordsData[selectedState].requestTemplate}
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* General Information */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Public Records Request Tips</h3>
          <button className="text-primary-400 hover:text-primary-300 flex items-center text-sm">
            <Download className="h-4 w-4 mr-1" />
            Download Guide
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              Be specific in your request
            </h4>
            <p className="text-gray-400 ml-6">
              Clearly identify the records you're seeking with as much detail as possible. Include relevant dates, document types, file numbers, and any other identifying information. Vague requests often lead to delays or denials.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              Narrow your request when possible
            </h4>
            <p className="text-gray-400 ml-6">
              Overly broad requests can result in excessive fees or delays. Consider limiting your request to a specific time period or subject matter. If you're unsure what records exist, consider calling the agency first to discuss what might be available.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              Follow up appropriately
            </h4>
            <p className="text-gray-400 ml-6">
              If you don't receive a response within the statutory timeframe, follow up with a polite email or phone call. Keep records of all communications, including dates, times, and the names of officials you speak with. This documentation can be important if you need to appeal or litigate.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium text-gray-300 mb-2 flex items-center">
              <ChevronRight className="h-4 w-4 text-primary-400 mr-1" />
              Request fee waivers when appropriate
            </h4>
            <p className="text-gray-400 ml-6">
              Many public records laws allow for fee waivers when disclosure is in the public interest. If your request serves the public interest (e.g., journalistic, academic, or nonprofit purposes), consider requesting a fee waiver and explaining how disclosure benefits the public.
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
              Public records laws vary by jurisdiction and change over time. Always consult with a qualified attorney for
              specific legal guidance tailored to your situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRecordsTool;