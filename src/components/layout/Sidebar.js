import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  Scale, 
  Search, 
  BookOpen, 
  Gavel, 
  Shield, 
  AlertTriangle, 
  BookMarked,
  TrendingDown,
  FileText,
  Users,
  Eye
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    jurisdictions: true,
    tools: false,
    resources: false
  });

  // Only show sidebar on certain pages
  const shouldShowSidebar = () => {
    const pathsWithSidebar = ['/', '/search', '/toolkit'];
    return pathsWithSidebar.includes(location.pathname) || 
           location.pathname.startsWith('/case/');
  };

  if (!shouldShowSidebar()) {
    return null;
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Sidebar animation variants
  const sidebarVariants = {
    open: { width: '280px', transition: { duration: 0.3 } },
    closed: { width: '60px', transition: { duration: 0.3 } }
  };

  // Content animation variants
  const contentVariants = {
    visible: { opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.2 } },
    hidden: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="sidebar bg-dark-800/80 backdrop-blur-lg border-r border-primary-700/30 h-[calc(100vh-64px)] sticky top-16 hidden md:block"
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.h2
                className="text-lg font-semibold text-white"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                Navigation
              </motion.h2>
            )}
          </AnimatePresence>
          
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-dark-700 text-gray-400 hover:text-white transition-colors"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronRight size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {/* Jurisdictions Section */}
            <li>
              <button
                onClick={() => isOpen && toggleSection('jurisdictions')}
                className={`w-full flex items-center justify-between p-2 rounded-md ${
                  expandedSections.jurisdictions && isOpen
                    ? 'bg-primary-900/50 text-primary-400'
                    : 'text-gray-300 hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center">
                  <Scale size={isOpen ? 18 : 24} className="min-w-[24px]" />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.span
                        className="ml-3 font-medium"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={contentVariants}
                      >
                        Jurisdictions
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={contentVariants}
                    >
                      {expandedSections.jurisdictions ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {isOpen && expandedSections.jurisdictions && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-6 mt-1 space-y-1 overflow-hidden"
                  >
                    <li>
                      <Link
                        to="/search?circuit=1"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        1st Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=2"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        2nd Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=3"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        3rd Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=4"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        4th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=5"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        5th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=6"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        6th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=7"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        7th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=8"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        8th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=9"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        9th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=10"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        10th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=11"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        11th Circuit
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/search?circuit=dc"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        D.C. Circuit
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Tools Section */}
            <li>
              <button
                onClick={() => isOpen && toggleSection('tools')}
                className={`w-full flex items-center justify-between p-2 rounded-md ${
                  expandedSections.tools && isOpen
                    ? 'bg-primary-900/50 text-primary-400'
                    : 'text-gray-300 hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center">
                  <Gavel size={isOpen ? 18 : 24} className="min-w-[24px]" />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.span
                        className="ml-3 font-medium"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={contentVariants}
                      >
                        Legal Tools
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={contentVariants}
                    >
                      {expandedSections.tools ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {isOpen && expandedSections.tools && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-6 mt-1 space-y-1 overflow-hidden"
                  >
                    <li>
                      <Link
                        to="/toolkit?tool=stop-and-id"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <Shield size={16} className="mr-2" />
                        Stop & ID Laws
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/toolkit?tool=public-records"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <FileText size={16} className="mr-2" />
                        Public Records
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/toolkit?tool=first-amendment"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <BookMarked size={16} className="mr-2" />
                        First Amendment
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/toolkit?tool=fourth-amendment"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <Eye size={16} className="mr-2" />
                        Fourth Amendment
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Resources Section */}
            <li>
              <button
                onClick={() => isOpen && toggleSection('resources')}
                className={`w-full flex items-center justify-between p-2 rounded-md ${
                  expandedSections.resources && isOpen
                    ? 'bg-primary-900/50 text-primary-400'
                    : 'text-gray-300 hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center">
                  <BookOpen size={isOpen ? 18 : 24} className="min-w-[24px]" />
                  <AnimatePresence mode="wait">
                    {isOpen && (
                      <motion.span
                        className="ml-3 font-medium"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={contentVariants}
                      >
                        Resources
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={contentVariants}
                    >
                      {expandedSections.resources ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <AnimatePresence>
                {isOpen && expandedSections.resources && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-6 mt-1 space-y-1 overflow-hidden"
                  >
                    <li>
                      <Link
                        to="/search"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <Search size={16} className="mr-2" />
                        Case Search
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/case/upload"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <FileText size={16} className="mr-2" />
                        Submit Case
                      </Link>
                    </li>
                    <li>
                      <a
                        href="https://www.justice.gov/crt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 text-sm text-gray-400 hover:text-primary-400 rounded-md hover:bg-dark-700"
                      >
                        <Users size={16} className="mr-2" />
                        DOJ Civil Rights
                      </a>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </nav>

        {/* Warning for 5th Circuit */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={contentVariants}
              className="mt-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg"
            >
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-400">5th Circuit Warning</h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Extreme hostility to civil rights in LA, TX, MS jurisdictions. Exercise heightened caution.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;