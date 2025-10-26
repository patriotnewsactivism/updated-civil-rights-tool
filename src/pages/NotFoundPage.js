import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale, Home, Search, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <Scale className="h-24 w-24 text-primary-400 opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-warning-500" />
            </div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-white mb-4"
        >
          404 - Page Not Found
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-400 mb-8"
        >
          The constitutional protection you're looking for appears to be outside our jurisdiction.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link 
            to="/" 
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            Return Home
          </Link>
          <Link 
            to="/search" 
            className="bg-dark-700 hover:bg-dark-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center transition-colors"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Cases
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 p-4 bg-dark-800/50 backdrop-blur-sm rounded-lg border border-dark-700"
        >
          <p className="text-sm text-gray-500">
            If you believe this page should exist, please report this issue to our team.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;