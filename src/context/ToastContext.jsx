import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

// Create the toast context
const ToastContext = createContext();

/**
 * Toast provider component
 * Manages toast notifications throughout the application
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  
  // Add a new toast
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    
    // Add the new toast to the array
    setToasts(prevToasts => [
      ...prevToasts,
      { id, message, type, duration }
    ]);
    
    // Remove the toast after the specified duration
    if (duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, []);
  
  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);
  
  // Helper methods for different toast types
  const success = useCallback((message, duration) => {
    return addToast(message, 'success', duration);
  }, [addToast]);
  
  const error = useCallback((message, duration) => {
    return addToast(message, 'error', duration);
  }, [addToast]);
  
  const warning = useCallback((message, duration) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);
  
  const info = useCallback((message, duration) => {
    return addToast(message, 'info', duration);
  }, [addToast]);
  
  // Toast component
  const Toast = ({ toast }) => {
    const { id, message, type } = toast;
    
    // Determine toast styles based on type
    const styles = {
      success: 'bg-green-50 border-green-500 text-green-800',
      error: 'bg-red-50 border-red-500 text-red-800',
      warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
      info: 'bg-blue-50 border-blue-500 text-blue-800',
    };
    
    return (
      <div 
        className={`rounded-lg border-l-4 p-4 shadow-md animate-slideUp ${styles[type] || styles.info}`}
        role="alert"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-2">{message}</div>
          <button
            onClick={() => removeToast(id)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };
  
  // Toast container
  const ToastContainer = () => {
    if (toasts.length === 0) return null;
    
    return (
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-sm w-full">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    );
  };
  
  // Context value
  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
  
  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Custom hook for using the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};