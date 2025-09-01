import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Heart, ExternalLink, Github } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { fontSize, changeFontSize } = useTheme();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900/80 backdrop-blur-lg border-t border-primary-700/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 text-primary-400 mr-2" />
              <h2 className="text-lg font-bold text-white">Constitutional Rights</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              A comprehensive platform for researching civil rights protections across different jurisdictions in the United States.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>© {currentYear} Constitutional Rights Research Platform</span>
            </div>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-gray-400 hover:text-primary-400 text-sm">
                  Case Search
                </Link>
              </li>
              <li>
                <Link to="/toolkit" className="text-gray-400 hover:text-primary-400 text-sm">
                  Legal Toolkit
                </Link>
              </li>
              <li>
                <Link to="/case/upload" className="text-gray-400 hover:text-primary-400 text-sm">
                  Submit a Case
                </Link>
              </li>
              <li>
                <a href="https://www.justice.gov/crt" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 text-sm flex items-center">
                  Civil Rights Division <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-primary-400 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-400 hover:text-primary-400 text-sm">
                  Legal Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-400 hover:text-primary-400 text-sm">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Accessibility */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Accessibility</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Text Size:</p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => changeFontSize('small')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      fontSize === 'small' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                    }`}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => changeFontSize('medium')}
                    className={`px-3 py-1 text-sm rounded-md ${
                      fontSize === 'medium' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                    }`}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => changeFontSize('large')}
                    className={`px-3 py-1 text-base rounded-md ${
                      fontSize === 'large' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
                    }`}
                  >
                    A
                  </button>
                </div>
              </div>
              
              <div>
                <a 
                  href="https://www.w3.org/WAI/WCAG2AA-Conformance" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-gray-400 hover:text-primary-400"
                >
                  <span>WCAG 2.1 AA Compliant</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-dark-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            This platform is for educational and research purposes only. Not legal advice.
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/patriotnewsactivism/civil-rights-tool" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary-400"
              aria-label="GitHub Repository"
            >
              <Github className="h-5 w-5" />
            </a>
            <span className="text-sm text-gray-500 flex items-center">
              Made with <Heart className="h-3 w-3 text-red-500 mx-1" /> for justice
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;