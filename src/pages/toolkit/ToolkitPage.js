import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Tool, 
  Shield, 
  FileText, 
  BookMarked, 
  Eye, 
  AlertTriangle,
  ChevronRight,
  Search,
  Download,
  Share2
} from 'lucide-react';

// Import toolkit components
import StopAndIdTool from './StopAndIdTool';
import PublicRecordsTool from './PublicRecordsTool';
import FirstAmendmentTool from './FirstAmendmentTool';
import FourthAmendmentTool from './FourthAmendmentTool';

const ToolkitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stop-and-id');
  
  // Parse the tool parameter from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tool = params.get('tool');
    if (tool && ['stop-and-id', 'public-records', 'first-amendment', 'fourth-amendment'].includes(tool)) {
      setActiveTab(tool);
    }
  }, [location.search]);
  
  // Update URL when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate({
      pathname: location.pathname,
      search: `?tool=${tab}`
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Legal Toolkit</h1>
        <p className="text-gray-400">
          Essential resources for understanding and protecting constitutional rights
        </p>
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div 
        variants={itemVariants}
        className="mb-6 overflow-x-auto"
      >
        <div className="flex space-x-2 min-w-max border-b border-dark-700">
          <button
            onClick={() => handleTabChange('stop-and-id')}
            className={`px-4 py-3 flex items-center whitespace-nowrap ${
              activeTab === 'stop-and-id'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Stop & ID Laws
          </button>
          <button
            onClick={() => handleTabChange('public-records')}
            className={`px-4 py-3 flex items-center whitespace-nowrap ${
              activeTab === 'public-records'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Public Records
          </button>
          <button
            onClick={() => handleTabChange('first-amendment')}
            className={`px-4 py-3 flex items-center whitespace-nowrap ${
              activeTab === 'first-amendment'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <BookMarked className="h-4 w-4 mr-2" />
            First Amendment
          </button>
          <button
            onClick={() => handleTabChange('fourth-amendment')}
            className={`px-4 py-3 flex items-center whitespace-nowrap ${
              activeTab === 'fourth-amendment'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Fourth Amendment
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        variants={itemVariants}
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700"
      >
        {activeTab === 'stop-and-id' && <StopAndIdTool />}
        {activeTab === 'public-records' && <PublicRecordsTool />}
        {activeTab === 'first-amendment' && <FirstAmendmentTool />}
        {activeTab === 'fourth-amendment' && <FourthAmendmentTool />}
      </motion.div>

      {/* Resource Cards */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Resource Card 1 */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group">
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Downloadable Templates</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Access ready-to-use legal templates for public records requests, complaints, and more.
          </p>
          <button className="text-primary-400 hover:text-primary-300 text-sm flex items-center">
            View Templates
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        {/* Resource Card 2 */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group">
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Legal Research</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Find key cases and legal resources for constitutional rights research.
          </p>
          <button className="text-primary-400 hover:text-primary-300 text-sm flex items-center">
            Explore Resources
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        {/* Resource Card 3 */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group">
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Risk Assessment</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Evaluate jurisdictional risks and constitutional protection levels by location.
          </p>
          <button className="text-primary-400 hover:text-primary-300 text-sm flex items-center">
            Assess Risk
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
        
        {/* Resource Card 4 */}
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group">
          <div className="flex items-center mb-3">
            <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
              <Share2 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Know Your Rights</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">
            Shareable guides explaining constitutional protections in everyday situations.
          </p>
          <button className="text-primary-400 hover:text-primary-300 text-sm flex items-center">
            Get Guides
            <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Legal Disclaimer */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 p-4 bg-dark-900/50 backdrop-blur-sm rounded-lg border border-dark-700"
      >
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-warning-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-warning-400 mb-2">Legal Disclaimer</h3>
            <p className="text-sm text-gray-400">
              This toolkit is provided for educational and informational purposes only and does not constitute legal advice.
              Constitutional law varies by jurisdiction and changes over time. Always consult with a qualified attorney for
              specific legal guidance tailored to your situation and jurisdiction.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToolkitPage;