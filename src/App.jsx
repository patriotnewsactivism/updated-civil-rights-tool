import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Gavel, 
  BookOpen, 
  FileText, 
  Users, 
  User,
  Scale,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'search', label: 'Search Cases', icon: Search },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'upload', label: 'Upload', icon: FileText },
    { id: 'dashboard', label: 'Dashboard', icon: Users, requiresAuth: true },
  ];
  
  const filteredNavItems = navItems.filter(item => 
    !item.requiresAuth || isAuthenticated
  );
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Add search logic here
  };
  
  const toggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Civil Rights Legal Tool
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            
            {/* Auth Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleAuth}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                {isAuthenticated ? 'Sign Out' : 'Sign In'}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-2 space-y-1">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Search U.S. Civil Rights Case Law
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Fast, public search across court opinions. Create an account to keep your findings.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search civil rights opinions, e.g., 'first amendment'..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Advanced Search
                </h3>
                <p className="text-gray-600 text-sm">
                  Search through thousands of civil rights cases with powerful filtering options.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Legal Resources
                </h3>
                <p className="text-gray-600 text-sm">
                  Access templates, guides, and educational materials for civil rights advocacy.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Community
                </h3>
                <p className="text-gray-600 text-sm">
                  Connect with other legal professionals and civil rights advocates.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'search' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Cases</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">Case search functionality coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'resources' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Resources</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">Legal resources and templates coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Case</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">Case upload functionality coming soon...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'dashboard' && isAuthenticated && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <p className="text-gray-600">Welcome to your dashboard!</p>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Civil Rights Legal Tool. All rights reserved.</p>
            <p className="mt-2">Built for research & education. Sources via CourtListener.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;