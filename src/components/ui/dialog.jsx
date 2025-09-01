import { useEffect, useRef } from 'react';

export function Dialog({ open, onClose, children, ...props }) {
  const dialogRef = useRef(null);
  
  // Handle Escape key press
  useEffect(() => { 
    function onKey(e) { 
      if (e.key === 'Escape') onClose(); 
    } 
    
    if (open) {
      document.addEventListener('keydown', onKey);
      // Lock body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    }
  }, [open, onClose]);
  
  // Focus trap implementation
  useEffect(() => {
    if (!open) return;
    
    const dialog = dialogRef.current;
    if (!dialog) return;
    
    // Find all focusable elements
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus the first element when dialog opens
    firstElement.focus();
    
    // Handle tab key to trap focus
    function handleTabKey(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        // If shift+tab and on first element, move to last element
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // If tab and on last element, move to first element
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    dialog.addEventListener('keydown', handleTabKey);
    return () => dialog.removeEventListener('keydown', handleTabKey);
  }, [open]);
  
  if (!open) return null;
  
  return (
    <div 
      role="dialog" 
      aria-modal="true"
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      {...props}
    >
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div 
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-200 animate-scaleIn"
      >
        {children}
      </div>
    </div>
  );
}