import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Pages
import HomePage from './pages/home/HomePage';
import SearchPage from './pages/search/SearchPage';
import CaseDetailPage from './pages/case/CaseDetailPage';
import CaseUploadPage from './pages/case/CaseUploadPage';
import ToolkitPage from './pages/toolkit/ToolkitPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SubscriptionPage from './pages/subscription/SubscriptionPage';
import ProfilePage from './pages/auth/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Styles
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app-container bg-gradient-to-br from-dark-900 via-primary-900 to-dark-800 min-h-screen text-white">
            <Header />
            <div className="main-content-wrapper flex">
              <Sidebar />
              <main className="flex-grow p-4 md:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/case/:id" element={<CaseDetailPage />} />
                    <Route path="/case/upload" element={<CaseUploadPage />} />
                    <Route path="/toolkit" element={<ToolkitPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AnimatePresence>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;