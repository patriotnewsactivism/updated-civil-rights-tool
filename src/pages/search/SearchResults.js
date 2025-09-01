import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Tag, 
  AlertTriangle, 
  ChevronRight, 
  BookOpen, 
  Scale,
  Star
} from 'lucide-react';

const SearchResults = ({ results }) => {
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
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {results.map((result) => (
        <motion.div
          key={result.id}
          variants={itemVariants}
          className={`bg-dark-800/50 backdrop-blur-sm rounded-xl p-5 border ${
            result.warning 
              ? 'border-red-700/50 hover:border-red-600/70' 
              : 'border-dark-700 hover:border-primary-700/50'
          } transition-colors`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="mr-3">
                {result.relevance > 90 ? (
                  <div className="bg-primary-900/50 text-primary-400 rounded-full w-10 h-10 flex items-center justify-center">
                    <Star className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="bg-dark-700 text-gray-400 rounded-full w-10 h-10 flex items-center justify-center">
                    <Scale className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white hover:text-primary-400 transition-colors">
                  <Link to={`/case/${result.id}`}>{result.title}</Link>
                </h3>
                <div className="text-sm text-gray-400">{result.citation}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{new Date(result.date).getFullYear()}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{result.court}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{result.summary}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {result.tags.map((tag, index) => (
              <div 
                key={index}
                className="flex items-center bg-dark-700 text-gray-300 px-2 py-1 rounded-md text-xs"
              >
                <Tag className="h-3 w-3 mr-1" />
                <span>{tag}</span>
              </div>
            ))}
          </div>
          
          {result.warning && (
            <div className="flex items-start mt-3 p-3 bg-red-900/30 rounded-md border border-red-700/30">
              <AlertTriangle className="h-4 w-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">
                Warning: This case represents a significant restriction of constitutional protections in the 5th Circuit.
              </p>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Relevance: <span className="font-medium">{result.relevance}%</span>
            </div>
            <Link 
              to={`/case/${result.id}`}
              className="flex items-center text-primary-400 hover:text-primary-300 text-sm font-medium"
            >
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SearchResults;