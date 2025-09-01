import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Search, 
  Upload, 
  Tool, 
  Shield, 
  BookMarked, 
  AlertTriangle,
  ChevronRight,
  MapPin
} from 'lucide-react';

// Import components
import JurisdictionMap from './JurisdictionMap';
import FeaturedCases from './FeaturedCases';
import CircuitHostilityChart from './CircuitHostilityChart';

const HomePage = () => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
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
      {/* Hero Section */}
      <motion.section 
        className="relative rounded-2xl overflow-hidden mb-12"
        variants={itemVariants}
      >
        <div className="bg-gradient-to-r from-primary-900 to-dark-900 p-8 md:p-12 lg:p-16">
          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Constitutional Rights Research Platform
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              Forensic analysis of systematic constitutional violations through jurisdictional manipulation, 
              documenting patterns of institutional circumvention of citizen rights across America's legal landscape.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              <Link 
                to="/search" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
              >
                <Search className="mr-2 h-5 w-5" />
                Search Cases
              </Link>
              <Link 
                to="/toolkit" 
                className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
              >
                <Tool className="mr-2 h-5 w-5" />
                Legal Toolkit
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <Scale className="w-full h-full text-primary-400" />
        </div>
      </motion.section>

      {/* Jurisdiction Map Section */}
      <motion.section 
        className="mb-12"
        variants={itemVariants}
      >
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-primary-700/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <MapPin className="mr-2 h-6 w-6 text-primary-400" />
                Jurisdictional Analysis Map
              </h2>
              <p className="text-gray-400">
                Explore constitutional protections across different federal circuits
              </p>
            </div>
            <Link 
              to="/search" 
              className="mt-4 md:mt-0 text-primary-400 hover:text-primary-300 flex items-center text-sm font-medium"
            >
              View detailed analysis
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="h-[400px] bg-dark-900/50 rounded-lg p-4 border border-dark-700">
            {/* This will be replaced by the actual JurisdictionMap component */}
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Interactive jurisdiction map will be displayed here</p>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-300">Protective</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-300">Moderate</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-300">Hostile</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Cases Section */}
      <motion.section 
        className="mb-12"
        variants={itemVariants}
      >
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-primary-700/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <BookMarked className="mr-2 h-6 w-6 text-primary-400" />
                Landmark Civil Rights Cases
              </h2>
              <p className="text-gray-400">
                Key precedents shaping constitutional protections
              </p>
            </div>
            <Link 
              to="/search?sort=importance" 
              className="mt-4 md:mt-0 text-primary-400 hover:text-primary-300 flex items-center text-sm font-medium"
            >
              View all landmark cases
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Case Card 1 */}
            <div className="bg-dark-900/50 rounded-lg p-5 border border-dark-700 hover:border-primary-700/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-primary-300">NAACP v. Alabama</h3>
                <span className="text-xs bg-primary-900/50 text-primary-400 px-2 py-1 rounded">1958</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Foundation for associational privacy in organizing
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">1st Amendment</span>
                <Link 
                  to="/case/naacp-v-alabama" 
                  className="text-primary-400 hover:text-primary-300 text-sm flex items-center"
                >
                  Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Case Card 2 */}
            <div className="bg-dark-900/50 rounded-lg p-5 border border-dark-700 hover:border-primary-700/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-primary-300">Brandenburg v. Ohio</h3>
                <span className="text-xs bg-primary-900/50 text-primary-400 px-2 py-1 rounded">1969</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Highest protection for political speech
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">1st Amendment</span>
                <Link 
                  to="/case/brandenburg-v-ohio" 
                  className="text-primary-400 hover:text-primary-300 text-sm flex items-center"
                >
                  Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Case Card 3 */}
            <div className="bg-dark-900/50 rounded-lg p-5 border border-dark-700 hover:border-primary-700/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-primary-300">Texas v. Johnson</h3>
                <span className="text-xs bg-primary-900/50 text-primary-400 px-2 py-1 rounded">1989</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                Symbolic political speech protection
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">1st Amendment</span>
                <Link 
                  to="/case/texas-v-johnson" 
                  className="text-primary-400 hover:text-primary-300 text-sm flex items-center"
                >
                  Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Circuit Hostility Chart */}
      <motion.section 
        className="mb-12"
        variants={itemVariants}
      >
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-primary-700/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-warning-400" />
                Circuit Court Hostility Analysis
              </h2>
              <p className="text-gray-400">
                Comparative analysis of constitutional protection levels
              </p>
            </div>
          </div>
          
          <div className="h-[300px] bg-dark-900/50 rounded-lg p-4 border border-dark-700">
            {/* This will be replaced by the actual CircuitHostilityChart component */}
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Circuit hostility chart will be displayed here</p>
            </div>
          </div>
          
          <div className="mt-6 bg-red-900/30 border border-red-700/50 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Critical Warning: 5th Circuit</h3>
                <p className="text-sm text-gray-300">
                  The 5th Circuit (Louisiana, Mississippi, Texas) has demonstrated extreme hostility to civil rights protections.
                  Recent decisions like <span className="text-red-400">McKesson v. Doe</span> create dangerous liability for protected First Amendment activity.
                  Exercise heightened caution in these jurisdictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Access Tools */}
      <motion.section 
        variants={itemVariants}
      >
        <div className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-primary-700/30">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary-400" />
            Quick Access Legal Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/toolkit?tool=stop-and-id" 
              className="bg-dark-900/50 rounded-lg p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Stop & ID Laws</h3>
              </div>
              <p className="text-sm text-gray-400">
                State-by-state analysis of identification requirements
              </p>
            </Link>
            
            <Link 
              to="/toolkit?tool=public-records" 
              className="bg-dark-900/50 rounded-lg p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Public Records</h3>
              </div>
              <p className="text-sm text-gray-400">
                Access laws and request templates by state
              </p>
            </Link>
            
            <Link 
              to="/toolkit?tool=first-amendment" 
              className="bg-dark-900/50 rounded-lg p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
                  <BookMarked className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">First Amendment</h3>
              </div>
              <p className="text-sm text-gray-400">
                Speech, press, assembly, and petition protections
              </p>
            </Link>
            
            <Link 
              to="/case/upload" 
              className="bg-dark-900/50 rounded-lg p-5 border border-dark-700 hover:border-primary-700/50 transition-colors group"
            >
              <div className="flex items-center mb-3">
                <div className="p-3 rounded-full bg-primary-900/30 text-primary-400 mr-3 group-hover:bg-primary-900/50 transition-colors">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">Submit Case</h3>
              </div>
              <p className="text-sm text-gray-400">
                Contribute to our database of civil rights jurisprudence
              </p>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Legal Disclaimer */}
      <motion.div 
        className="mt-12 bg-dark-900/50 backdrop-blur-sm rounded-lg p-6 border border-dark-700"
        variants={itemVariants}
      >
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-warning-400 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-warning-400 mb-2">Legal Disclaimer</h3>
            <p className="text-sm text-gray-400">
              This research platform documents systematic patterns of constitutional circumvention through jurisdictional manipulation.
              It does not constitute legal advice. Constitutional law changes rapidly, and circuit precedents evolve constantly.
              Always consult with a qualified attorney for specific legal guidance.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;